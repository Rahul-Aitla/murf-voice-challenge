import logging
import json
from pathlib import Path
from dataclasses import dataclass
from typing import Optional

from dotenv import load_dotenv
from livekit.agents import (
    JobContext,
    WorkerOptions,
    cli,
    function_tool,
    RunContext,
    ChatContext,
)
from livekit.agents.voice import Agent, AgentSession
from livekit.plugins import murf, silero, google, deepgram

logger = logging.getLogger("tutor_agent")

load_dotenv(".env.local")

# Path to the tutor content file
TUTOR_CONTENT_PATH = Path("shared-data/day4_tutor_content.json")

# Load the tutor content
def load_tutor_content():
    """Load the tutor content from JSON file."""
    if not TUTOR_CONTENT_PATH.exists():
        logger.error(f"Tutor content file not found at {TUTOR_CONTENT_PATH}")
        return []
    
    try:
        with open(TUTOR_CONTENT_PATH, 'r') as f:
            content = json.load(f)
            logger.info(f"Loaded {len(content)} concepts from tutor content file")
            return content
    except Exception as e:
        logger.error(f"Error loading tutor content: {e}")
        return []

# Global tutor content
TUTOR_CONTENT = load_tutor_content()


@dataclass
class TutorSessionData:
    """Stores data to be shared across agent transfers"""
    ctx: Optional[JobContext] = None
    
    def summarize(self) -> str:
        return "Tutor session for learning programming concepts"


RunContext_T = RunContext[TutorSessionData]


class GreeterAgent(Agent):
    """Initial agent that greets the user - Matthew's voice."""
    
    def __init__(self, chat_ctx: Optional[ChatContext] = None):
        concept_list = "\n".join([f"- {c['title']}" for c in TUTOR_CONTENT])
        
        super().__init__(
            instructions=f"""You are Matthew, a friendly teaching assistant helping students learn programming.

Your job is to:
1. **Greet the user warmly** 
2. **Explain the three learning modes** available:
   - **LEARN mode**: I (Matthew) will explain programming concepts in detail
   - **QUIZ mode**: Alicia will ask you questions to test your understanding
   - **TEACH BACK mode**: Ken will listen as you explain concepts back
   
3. **Ask which mode they'd like** (learn, quiz, or teach_back)
4. **Once they choose**, use the appropriate transfer tool

Available concepts:
{concept_list}

Keep it conversational and encouraging!""",
            stt=deepgram.STT(model="nova-3"),
            llm=google.LLM(model="gemini-2.5-flash"),
            tts=murf.TTS(voice="en-US-matthew", style="Conversation"),
            vad=silero.VAD.load(),
            chat_ctx=chat_ctx,
        )
    
    async def on_enter(self) -> None:
        """Called when this agent becomes active."""
        logger.info("Entering GreeterAgent (Matthew)")
        await self.session.generate_reply(
            instructions="Greet the user warmly and explain the three learning modes available."
        )
    
    @function_tool
    async def transfer_to_learn_mode(self, context: RunContext_T):
        """Transfer to Learn mode with Matthew's voice."""
        logger.info("Transferring to Learn mode (Matthew)")
        await self.session.say("Great! Let's start learning. What concept would you like me to explain?")
        return LearnModeAgent(chat_ctx=self.chat_ctx)
    
    @function_tool
    async def transfer_to_quiz_mode(self, context: RunContext_T):
        """Transfer to Quiz mode with Alicia's voice."""
        logger.info("Transferring to Quiz mode (Alicia)")
        await self.session.say("Perfect! I'll transfer you to Alicia who will quiz you.")
        return QuizModeAgent(chat_ctx=self.chat_ctx)
    
    @function_tool
    async def transfer_to_teachback_mode(self, context: RunContext_T):
        """Transfer to Teach Back mode with Ken's voice."""
        logger.info("Transferring to Teach Back mode (Ken)")
        await self.session.say("Excellent! I'll transfer you to Ken who will listen to your explanation.")
        return TeachBackModeAgent(chat_ctx=self.chat_ctx)


class LearnModeAgent(Agent):
    """Learn mode - explains concepts - Matthew's voice."""
    
    def __init__(self, chat_ctx: Optional[ChatContext] = None):
        concept_details = "\n\n".join([
            f"**{c['title']}**:\n{c['summary']}" 
            for c in TUTOR_CONTENT
        ])
        
        super().__init__(
            instructions=f"""You are Matthew, a patient programming tutor in LEARN mode.

**Your role:**
1. Explain programming concepts clearly when asked
2. Use simple language, examples, and analogies
3. Be encouraging and supportive
4. Allow mode switching anytime

**MODE SWITCHING:**
- If user wants to be quizzed → use `transfer_to_quiz_mode` (Alicia will quiz them)
- If user wants to teach back → use `transfer_to_teachback_mode` (Ken will listen)
- If user wants main menu → use `transfer_to_greeter`

**Available Concepts:**
{concept_details}

When explaining:
- Start with big picture, then details
- Use real-world analogies
- Give code examples when helpful
- Check for understanding""",
            stt=deepgram.STT(model="nova-3"),
            llm=google.LLM(model="gemini-2.5-flash"),
            tts=murf.TTS(voice="en-US-matthew", style="Conversation"),
            vad=silero.VAD.load(),
            chat_ctx=chat_ctx,
        )
    
    async def on_enter(self) -> None:
        """Called when this agent becomes active."""
        logger.info("Entering LearnModeAgent (Matthew)")
    
    @function_tool
    async def transfer_to_quiz_mode(self, context: RunContext_T):
        """Switch to Quiz mode with Alicia."""
        logger.info("Switching to Quiz mode (Alicia)")
        await self.session.say("Let me transfer you to Alicia for the quiz!")
        return QuizModeAgent(chat_ctx=self.chat_ctx)
    
    @function_tool
    async def transfer_to_teachback_mode(self, context: RunContext_T):
        """Switch to Teach Back mode with Ken."""
        logger.info("Switching to Teach Back mode (Ken)")
        await self.session.say("I'll transfer you to Ken who will listen to your teaching!")
        return TeachBackModeAgent(chat_ctx=self.chat_ctx)
    
    @function_tool
    async def transfer_to_greeter(self, context: RunContext_T):
        """Return to greeter."""
        logger.info("Returning to greeter (Matthew)")
        await self.session.say("Going back to the main menu.")
        return GreeterAgent(chat_ctx=self.chat_ctx)


class QuizModeAgent(Agent):
    """Quiz mode - asks questions - Alicia's voice."""
    
    def __init__(self, chat_ctx: Optional[ChatContext] = None):
        quiz_questions = "\n\n".join([
            f"**{c['title']}**:\nQuestion: {c['sample_question']}" 
            for c in TUTOR_CONTENT
        ])
        
        super().__init__(
            instructions=f"""You are Alicia, an enthusiastic quiz master in QUIZ mode.

**Your role:**
1. Ask questions about programming concepts
2. Listen carefully to answers
3. Provide constructive feedback - what's right, what needs work
4. Encourage and celebrate progress!
5. Allow mode switching anytime

**MODE SWITCHING:**
- If user wants to learn → use `transfer_to_learn_mode` (Matthew will explain)
- If user wants to teach → use `transfer_to_teachback_mode` (Ken will listen)
- If user wants main menu → use `transfer_to_greeter`

**Quiz Questions:**
{quiz_questions}

Quiz Flow:
1. Ask which concept to quiz on
2. Ask the sample question or variations
3. Listen to their answer
4. Give constructive feedback

Keep it fun and supportive!""",
            stt=deepgram.STT(model="nova-3"),
            llm=google.LLM(model="gemini-2.5-flash"),
            tts=murf.TTS(voice="en-US-alicia", style="Conversation"),  # 🎤 ALICIA'S VOICE
            vad=silero.VAD.load(),
            chat_ctx=chat_ctx,
        )
    
    async def on_enter(self) -> None:
        """Called when this agent becomes active."""
        logger.info("Entering QuizModeAgent (Alicia)")
        await self.session.generate_reply(
            instructions="Introduce yourself as Alicia and ask which concept they'd like to be quizzed on."
        )
    
    @function_tool
    async def transfer_to_learn_mode(self, context: RunContext_T):
        """Switch to Learn mode with Matthew."""
        logger.info("Switching to Learn mode (Matthew)")
        await self.session.say("Let me transfer you back to Matthew for learning!")
        return LearnModeAgent(chat_ctx=self.chat_ctx)
    
    @function_tool
    async def transfer_to_teachback_mode(self, context: RunContext_T):
        """Switch to Teach Back mode with Ken."""
        logger.info("Switching to Teach Back mode (Ken)")
        await self.session.say("I'll transfer you to Ken for teach back mode!")
        return TeachBackModeAgent(chat_ctx=self.chat_ctx)
    
    @function_tool
    async def transfer_to_greeter(self, context: RunContext_T):
        """Return to greeter."""
        logger.info("Returning to greeter (Matthew)")
        await self.session.say("Going back to the main menu.")
        return GreeterAgent(chat_ctx=self.chat_ctx)


class TeachBackModeAgent(Agent):
    """Teach Back mode - listens to user - Ken's voice."""
    
    def __init__(self, chat_ctx: Optional[ChatContext] = None):
        concept_list = "\n".join([f"- {c['title']}" for c in TUTOR_CONTENT])
        
        super().__init__(
            instructions=f"""You are Ken, a supportive mentor in TEACH BACK mode.

**Your role:**
1. Ask the user to teach YOU a concept
2. Listen actively as they explain
3. **Give qualitative feedback:**
   - What they explained well
   - What was clear and accurate  
   - What could be clearer
   - Gently correct misconceptions
4. Be encouraging - teaching is hard!
5. Allow mode switching anytime

**MODE SWITCHING:**
- If user wants to learn → use `transfer_to_learn_mode` (Matthew will explain)
- If user wants a quiz → use `transfer_to_quiz_mode` (Alicia will quiz)
- If user wants main menu → use `transfer_to_greeter`

**Available Concepts:**
{concept_list}

Teaching Back Flow:
1. Ask which concept they'll teach you
2. Listen patiently as they explain
3. Give thoughtful, constructive feedback
4. Celebrate their effort!

Be patient and kind!""",
            stt=deepgram.STT(model="nova-3"),
            llm=google.LLM(model="gemini-2.5-flash"),
            tts=murf.TTS(voice="en-US-ken", style="Conversation"),  # 🎤 KEN'S VOICE
            vad=silero.VAD.load(),
            chat_ctx=chat_ctx,
        )
    
    async def on_enter(self) -> None:
        """Called when this agent becomes active."""
        logger.info("Entering TeachBackModeAgent (Ken)")
        await self.session.generate_reply(
            instructions="Introduce yourself as Ken and ask which concept they'd like to teach you about."
        )
    
    @function_tool
    async def transfer_to_learn_mode(self, context: RunContext_T):
        """Switch to Learn mode with Matthew."""
        logger.info("Switching to Learn mode (Matthew)")
        await self.session.say("Let me transfer you to Matthew for some learning!")
        return LearnModeAgent(chat_ctx=self.chat_ctx)
    
    @function_tool
    async def transfer_to_quiz_mode(self, context: RunContext_T):
        """Switch to Quiz mode with Alicia."""
        logger.info("Switching to Quiz mode (Alicia)")
        await self.session.say("I'll transfer you to Alicia for a quiz!")
        return QuizModeAgent(chat_ctx=self.chat_ctx)
    
    @function_tool
    async def transfer_to_greeter(self, context: RunContext_T):
        """Return to greeter."""
        logger.info("Returning to greeter (Matthew)")
        await self.session.say("Going back to the main menu.")
        return GreeterAgent(chat_ctx=self.chat_ctx)


async def entrypoint(ctx: JobContext):
    """Entry point that sets up the session with the initial Greeter agent."""
    
    userdata = TutorSessionData(ctx=ctx)
    
    # Create session with typed userdata
    session = AgentSession[TutorSessionData](userdata=userdata)
    
    # Start with the Greeter agent (Matthew's voice)
    await session.start(
        agent=GreeterAgent(),
        room=ctx.room,
    )


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
