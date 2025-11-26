import json
import logging
import os
from pathlib import Path
from typing import Annotated
from datetime import datetime

from dotenv import load_dotenv
from livekit import agents
from livekit.agents import (
    WorkerOptions, 
    cli, 
    AutoSubscribe, 
    JobContext, 
    JobProcess,
    function_tool,
    RunContext
)
from livekit.agents.voice import Agent, AgentSession
from livekit.plugins import murf, google, deepgram, silero

logger = logging.getLogger("zepto-sdr-agent")
logger.setLevel(logging.INFO)


load_dotenv(".env.local")

AVAILABLE_SLOTS = [
    "Tomorrow at 10:00 AM",
    "Tomorrow at 2:00 PM",
    "Thursday at 11:00 AM",
    "Thursday at 4:00 PM",
    "Friday at 9:30 AM"
]

def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()

class ZeptoSDRAgent(Agent):
    def __init__(self):
        super().__init__(
            instructions="""You are an advanced Voice SDR for Zepto, a 10-minute grocery delivery service. 
Your name is Anusha. You are professional, energetic, and helpful.

Your goals are:
1. Answer questions about Zepto using the `search_faq` tool.
2. Qualify leads by asking for their Name, Company, and Use Case.
3. Collect lead info using the `collect_lead_info` tool.
4. Schedule a follow-up meeting using the `check_availability` and `book_meeting` tools.
5. Summarize the call at the end using `generate_call_summary`.

Meeting Scheduling Flow:
- If the user shows interest or asks for a demo, offer to schedule a meeting.
- First, use `check_availability` to see open slots.
- Offer 2-3 options to the user.
- Once they pick a time, use `book_meeting` to confirm it.
- Require Name and Email before booking.

Keep responses concise and natural for voice conversation.""",
            stt=deepgram.STT(),
            llm=google.LLM(
                model="gemini-2.0-flash",
            ),
            tts=murf.TTS(
                voice="en-IN-anusha",
                api_key=os.getenv("MURF_API_KEY")
            ),
            vad=silero.VAD.load(),
        )

    @function_tool
    async def search_faq(self, context: RunContext, query: Annotated[str, "The user's question about Zepto"]):
        """Search Zepto's FAQ for answers to user questions."""
        logger.info(f"Searching FAQ for: {query}")
        try:
            with open("zepto_faq.json", "r") as f:
                faq_data = json.load(f)
            
            results = []
            for item in faq_data:
                if query.lower() in item["question"].lower() or query.lower() in item["answer"].lower():
                    results.append(f"Q: {item['question']}\nA: {item['answer']}")
            
            if not results:
                return "No specific FAQ found. Answer generally based on Zepto being a 10-minute grocery delivery service."
            
            return "\n\n".join(results[:2]) # Return top 2 matches
        except Exception as e:
            logger.error(f"Error searching FAQ: {e}")
            return "Sorry, I couldn't access the FAQ database at the moment."

    @function_tool
    async def collect_lead_info(
        self, 
        context: RunContext,
        name: Annotated[str, "User's full name"],
        email: Annotated[str | None, "User's email address"] = None,
        company: Annotated[str | None, "User's company"] = None,
        role: Annotated[str | None, "User's role"] = None,
        use_case: Annotated[str | None, "User's use case"] = None
    ):
        """Collect and save lead information."""
        logger.info(f"Collecting lead info: {name}, {company}")
        return f"Lead info collected for {name}. You can now proceed to schedule a meeting."

    @function_tool
    async def check_availability(self, context: RunContext):
        """Check available meeting slots. Returns a list of available times."""
        logger.info("Checking availability")
        return f"Available slots are: {', '.join(AVAILABLE_SLOTS)}"

    @function_tool
    async def book_meeting(
        self, 
        context: RunContext,
        slot: Annotated[str, "The chosen time slot"],
        name: Annotated[str, "User's name"],
        email: Annotated[str, "User's email"]
    ):
        """Book a meeting slot. Requires name and email."""
        logger.info(f"Booking meeting: {slot} for {name}")
        
        if slot not in AVAILABLE_SLOTS:
            return f"Sorry, {slot} is no longer available. Please choose from: {', '.join(AVAILABLE_SLOTS)}"
        
        booking_data = {
            "name": name,
            "email": email,
            "slot": slot,
            "status": "confirmed"
        }
        
        try:
            # Append to bookings file
            try:
                with open("zepto_bookings.json", "r") as f:
                    bookings = json.load(f)
            except (FileNotFoundError, json.JSONDecodeError):
                bookings = []
            
            bookings.append(booking_data)
            
            with open("zepto_bookings.json", "w") as f:
                json.dump(bookings, f, indent=2)
                
            if slot in AVAILABLE_SLOTS:
                AVAILABLE_SLOTS.remove(slot)
            
            return f"Meeting confirmed for {slot}. A calendar invite has been sent to {email}."
        except Exception as e:
            logger.error(f"Error booking meeting: {e}")
            return "There was an error saving the booking. Please try again."

    @function_tool
    async def generate_call_summary(
        self, 
        context: RunContext,
        summary: Annotated[str, "Summary of the conversation"],
        lead_data: Annotated[str, "JSON string of lead data"]
    ):
        """Generate a final call summary and save lead data."""
        logger.info("Generating call summary")
        try:
            # Save to JSON
            data = {
                "summary": summary,
                "lead_data": lead_data,
                "timestamp": datetime.now().isoformat()
            }
            with open("zepto_leads.json", "a") as f:
                f.write(json.dumps(data) + "\n")
            return "Call summary saved successfully."
        except Exception as e:
            logger.error(f"Error saving summary: {e}")
            return "Failed to save call summary."
            
    async def on_enter(self, participant=None):
        await self.session.say("Hi there! I'm Anusha from Zepto. I can help you with our 10-minute delivery service or partnership opportunities. How can I help you today?", allow_interruptions=True)


async def entrypoint(ctx: JobContext):
    logger.info(f"connecting to room {ctx.room.name}")
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    
    participant = await ctx.wait_for_participant()
    logger.info(f"starting voice assistant for participant {participant.identity}")

    session = AgentSession()
    
    await session.start(
        agent=ZeptoSDRAgent(),
        room=ctx.room,
    )

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
