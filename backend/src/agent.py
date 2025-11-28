import logging
import json
import os
from datetime import datetime
from pathlib import Path
from typing import List, Optional

from dotenv import load_dotenv
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    JobProcess,
    MetricsCollectedEvent,
    RoomInputOptions,
    WorkerOptions,
    cli,
    metrics,
    tokenize,
    llm,
    function_tool,
    RunContext,
)
from livekit.plugins import murf, silero, google, deepgram, noise_cancellation
from livekit.plugins.turn_detector.multilingual import MultilingualModel
from wellness_notion import get_notion_client
from game_master_agent import GameMasterAgent

logger = logging.getLogger("agent")

load_dotenv(".env.local")

# Path to the wellness log file
WELLNESS_LOG_PATH = Path("wellness_log.json")


class WellnessAssistant(Agent):
    def __init__(self) -> None:
        # Load previous check-ins for context
        previous_context = self._load_previous_context()
        
        super().__init__(
            instructions=f"""You are a supportive daily health & wellness companion.
            Your role is to conduct short, friendly check-ins to help users reflect on their wellbeing and set daily intentions.
            
            IMPORTANT GUIDELINES:
            - You are NOT a medical professional. Never diagnose or provide medical advice.
            - Be warm, empathetic, and supportive.
            - Keep the conversation natural and conversational, not robotic.
            - Ask questions thoughtfully and listen actively.
            - Provide simple, practical, non-medical suggestions when appropriate.
            
            YOUR CONVERSATION FLOW:
            1. **Greet the user warmly** and ask about their mood and energy level
               - Example: "How are you feeling today?"
               - "What's your energy like right now?"
               - "Anything particularly stressing you out or on your mind?"
            
            2. **Ask about their daily intentions/objectives**
               - Example: "What are 1-3 things you'd like to accomplish today?"
               - "Is there anything you want to do for yourself today - rest, exercise, hobbies?"
            
            3. **Offer simple, realistic advice or reflections**
               - Break large goals into smaller steps
               - Encourage short breaks
               - Suggest simple grounding activities (e.g., "take a 5-minute walk", "drink some water")
               - Be specific and actionable, not generic
            
            4. **Close with a brief recap**
               - Summarize their mood
               - Repeat back their 1-3 main objectives
               - Ask: "Does this sound right?"
               - Once confirmed, use the `save_check_in` tool to store the session data
               - THEN ask: "Would you like me to save these objectives to your Notion workspace so you can track them there as well?"
               - If yes, use the `save_to_notion` tool
            
            {previous_context}
            
            Remember: Keep it conversational, supportive, and grounded. You're here to listen and provide gentle guidance, not to diagnose or prescribe.""",
        )

    def _load_previous_context(self) -> str:
        """Load previous check-ins to provide context for the current session."""
        if not WELLNESS_LOG_PATH.exists():
            return "This is the user's first check-in session."
        
        try:
            with open(WELLNESS_LOG_PATH, 'r') as f:
                data = json.load(f)
                entries = data.get('entries', [])
                
                if not entries:
                    return "This is the user's first check-in session."
                
                # Get the most recent entry
                last_entry = entries[-1]
                
                context = f"""PREVIOUS CHECK-IN CONTEXT:
                Last check-in was on {last_entry.get('date', 'unknown date')}.
                - Mood: {last_entry.get('mood', 'not recorded')}
                - Energy: {last_entry.get('energy', 'not recorded')}
                - Objectives: {', '.join(last_entry.get('objectives', []))}
                
                Start the conversation by referencing this previous session naturally.
                For example: "Last time we talked, you mentioned {last_entry.get('mood', 'feeling')}. How does today compare?"
                """
                
                return context
                
        except Exception as e:
            logger.error(f"Error loading previous context: {e}")
            return "This is the user's first check-in session."

    @function_tool
    async def save_check_in(
        self,
        context: RunContext,
        mood: str,
        energy: str,
        objectives: List[str],
        stressors: Optional[str] = None,
        summary: Optional[str] = None,
    ):
        """Save the current check-in session data to the wellness log.

        Args:
            mood: The user's self-reported mood (e.g., "good", "tired", "stressed", "energetic").
            energy: The user's energy level (e.g., "high", "medium", "low", "drained").
            objectives: List of 1-3 daily objectives or intentions the user wants to achieve.
            stressors: Optional description of what's stressing them out or on their mind.
            summary: Optional brief summary of the check-in session.
        """
        # Create the check-in entry
        entry = {
            "date": datetime.now().strftime("%Y-%m-%d"),
            "time": datetime.now().strftime("%H:%M:%S"),
            "timestamp": datetime.now().isoformat(),
            "mood": mood,
            "energy": energy,
            "objectives": objectives,
        }
        
        if stressors:
            entry["stressors"] = stressors
        
        if summary:
            entry["summary"] = summary
        else:
            # Generate a simple summary
            entry["summary"] = f"Feeling {mood} with {energy} energy. Focus areas: {', '.join(objectives[:2])}"
        
        # Load existing data or create new structure
        if WELLNESS_LOG_PATH.exists():
            with open(WELLNESS_LOG_PATH, 'r') as f:
                data = json.load(f)
        else:
            data = {"entries": []}
        
        # Add the new entry
        data["entries"].append(entry)
        
        # Save to file
        with open(WELLNESS_LOG_PATH, 'w') as f:
            json.dump(data, f, indent=2)
        
        logger.info(f"Saved check-in: {entry}")
        
        return f"Check-in saved successfully! I've recorded your mood ({mood}), energy level ({energy}), and your objectives: {', '.join(objectives)}. Great job setting your intentions for today!"

    @function_tool
    async def get_previous_check_ins(
        self,
        context: RunContext,
        num_entries: int = 5,
    ):
        """Retrieve previous check-in entries for reference.

        Args:
            num_entries: Number of recent entries to retrieve (default: 5).
        """
        if not WELLNESS_LOG_PATH.exists():
            return "No previous check-ins found."
        
        try:
            with open(WELLNESS_LOG_PATH, 'r') as f:
                data = json.load(f)
                entries = data.get('entries', [])
                
                if not entries:
                    return "No previous check-ins found."
                
                # Get the most recent entries
                recent_entries = entries[-num_entries:]
                
                result = f"Found {len(recent_entries)} recent check-in(s):\n\n"
                for entry in recent_entries:
                    result += f"Date: {entry.get('date', 'unknown')}\n"
                    result += f"Mood: {entry.get('mood', 'not recorded')}\n"
                    result += f"Energy: {entry.get('energy', 'not recorded')}\n"
                    result += f"Objectives: {', '.join(entry.get('objectives', []))}\n"
                    if 'summary' in entry:
                        result += f"Summary: {entry['summary']}\n"
                    result += "\n"
                
                return result
                
        except Exception as e:
            logger.error(f"Error retrieving check-ins: {e}")
            return f"Error retrieving previous check-ins: {str(e)}"

    @function_tool
    async def save_to_notion(
        self,
        context: RunContext,
    ):
        """Save the most recent check-in to Notion database.
        
        This tool saves the user's wellness check-in (mood, energy, objectives) to their Notion workspace
        for better tracking and organization.
        
        Returns:
            Success message with Notion page URL, or error message if something goes wrong.
        """
        # Get Notion client
        notion = get_notion_client()
        
        # Check if Notion is enabled
        if not notion.is_enabled():
            return "I'm sorry, but Notion integration isn't set up yet. Your check-in is still saved locally though!"
        
        # Get the most recent check-in from local storage
        if not WELLNESS_LOG_PATH.exists():
            return "I don't have any check-in data to save to Notion. Please complete a check-in first."
        
        try:
            with open(WELLNESS_LOG_PATH, 'r') as f:
                data = json.load(f)
                entries = data.get('entries', [])
                
                if not entries:
                    return "No check-in data found to save to Notion."
                
                # Get the most recent entry
                last_entry = entries[-1]
            
            # Create entry in Notion
            result = await notion.create_wellness_entry(
                date=last_entry['date'],
                mood=last_entry['mood'],
                energy=last_entry['energy'],
                objectives=last_entry['objectives'],
                stressors=last_entry.get('stressors'),
                summary=last_entry.get('summary')
            )
            
            logger.info(f"Successfully saved check-in to Notion: {result['page_id']}")
            
            obj_count = len(last_entry['objectives'])
            obj_word = "objective" if obj_count == 1 else "objectives"
            
            return f"Perfect! I've created a new entry in your Daily Wellness database with your {obj_count} {obj_word}. You can view and track it in Notion anytime!"
            
        except Exception as e:
            logger.error(f"Error saving to Notion: {e}")
            return f"I had trouble connecting to Notion right now, but don't worry - your check-in is still saved locally! You can try again later."


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    # Logging setup
    # Add any other context you want in all log entries here
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }

    # Set up a voice AI pipeline using OpenAI, Cartesia, AssemblyAI, and the LiveKit turn detector
    session = AgentSession(
        # Speech-to-text (STT) is your agent's ears, turning the user's speech into text that the LLM can understand
        # See all available models at https://docs.livekit.io/agents/models/stt/
        stt=deepgram.STT(model="nova-3"),
        # A Large Language Model (LLM) is your agent's brain, processing user input and generating a response
        # See all available models at https://docs.livekit.io/agents/models/llm/
        llm=google.LLM(
                model="gemini-2.5-flash",
            ),
        # Text-to-speech (TTS) is your agent's voice, turning the LLM's text into speech that the user can hear
        # See all available models as well as voice selections at https://docs.livekit.io/agents/models/tts/
        tts=murf.TTS(
                voice="en-US-matthew", 
                style="Conversation",
                tokenizer=tokenize.basic.SentenceTokenizer(min_sentence_len=2),
                text_pacing=True
            ),
        # VAD and turn detection are used to determine when the user is speaking and when the agent should respond
        # See more at https://docs.livekit.io/agents/build/turns
        turn_detection=MultilingualModel(),
        vad=ctx.proc.userdata["vad"],
        # allow the LLM to generate a response while waiting for the end of turn
        # See more at https://docs.livekit.io/agents/build/audio/#preemptive-generation
        preemptive_generation=True,
    )

    # To use a realtime model instead of a voice pipeline, use the following session setup instead.
    # (Note: This is for the OpenAI Realtime API. For other providers, see https://docs.livekit.io/agents/models/realtime/))
    # 1. Install livekit-agents[openai]
    # 2. Set OPENAI_API_KEY in .env.local
    # 3. Add `from livekit.plugins import openai` to the top of this file
    # 4. Use the following session setup instead of the version above
    # session = AgentSession(
    #     llm=openai.realtime.RealtimeModel(voice="marin")
    # )

    # Metrics collection, to measure pipeline performance
    # For more information, see https://docs.livekit.io/agents/build/metrics/
    usage_collector = metrics.UsageCollector()

    @session.on("metrics_collected")
    def _on_metrics_collected(ev: MetricsCollectedEvent):
        metrics.log_metrics(ev.metrics)
        usage_collector.collect(ev.metrics)

    async def log_usage():
        summary = usage_collector.get_summary()
        logger.info(f"Usage: {summary}")

    ctx.add_shutdown_callback(log_usage)

    # # Add a virtual avatar to the session, if desired
    # # For other providers, see https://docs.livekit.io/agents/models/avatar/
    # avatar = hedra.AvatarSession(
    #   avatar_id="...",  # See https://docs.livekit.io/agents/models/avatar/plugins/hedra
    # )
    # # Start the avatar and wait for it to join
    # await avatar.start(session, room=ctx.room)

    # Start the session, which initializes the voice pipeline and warms up the models
    await session.start(
        agent=GameMasterAgent(),
        room=ctx.room,
        room_input_options=RoomInputOptions(
            # For telephony applications, use `BVCTelephony` for best results
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    # Join the room and connect to the user
    await ctx.connect()


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
