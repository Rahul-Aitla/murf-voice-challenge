import sqlite3
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

logger = logging.getLogger("fraud-alert-agent")
logger.setLevel(logging.INFO)

load_dotenv(".env.local")

DB_PATH = Path("fraud_cases.db")

def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()

class FraudAlertAgent(Agent):
    def __init__(self):
        super().__init__(
            instructions="""You are a Fraud Alert Agent for a bank. Your name is Sanket.
You are professional, calm, and reassuring.

Your goal is to verify a suspicious transaction with the customer.

**Conversation Flow:**
1. **Introduction & Identification:**
   - Introduce yourself as Sanket from the Fampay's Fraud Department.
   - Ask the user for their username to pull up their file.
   - Use the `load_case` tool with the provided username.

2. **Verification:**
   - Once the case is loaded, ask the security question associated with the account (from the loaded case data).
   - Verify the answer using the `verify_identity` tool.
   - If verification fails, politely end the call.

3. **Transaction Review:**
   - If verified, read out the suspicious transaction details:
     - Merchant Name
     - Amount
     - Date/Time
     - Location
   - Ask the user if they authorized this transaction.

4. **Resolution:**
   - If the user says **YES** (they made it):
     - Mark the case as safe using `resolve_fraud_case(status="confirmed_safe", note="User confirmed transaction")`.
     - Tell the user the hold has been lifted and they can continue using their card.
   - If the user says **NO** (they didn't make it):
     - Mark the case as fraud using `resolve_fraud_case(status="confirmed_fraud", note="User denied transaction")`.
     - Tell the user you have blocked the card and a new one will be mailed to them.

5. **Closing:**
   - Thank the user and end the call.

**Important:**
- Do NOT ask for real card numbers, PINs, or passwords.
- Only use the data provided in the loaded case.
- Be concise and clear.
""",
            stt=deepgram.STT(),
            llm=google.LLM(
                model="gemini-2.0-flash",
            ),
            tts=murf.TTS(
                voice="en-US-cooper", # Using a professional sounding voice
                api_key=os.getenv("MURF_API_KEY")
            ),
            vad=silero.VAD.load(),
        )
        self.current_case = None

    @function_tool
    async def load_case(self, context: RunContext, username: Annotated[str, "The username provided by the user"]):
        """Load the fraud case for a given username."""
        logger.info(f"Loading case for: {username}")
        try:
            if not DB_PATH.exists():
                return "Error: Database not found."

            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            cursor.execute("SELECT * FROM fraud_cases WHERE userName LIKE ?", (username,))
            row = cursor.fetchone()
            conn.close()
            
            if row:
                self.current_case = dict(row)
                return f"Case found. Security Question: {row['securityQuestion']}. Transaction: {row['amount']} at {row['transactionName']}."
            else:
                return "User not found. Please ask the user to repeat their username."
        except Exception as e:
            logger.error(f"Error loading case: {e}")
            return "System error loading case."

    @function_tool
    async def verify_identity(self, context: RunContext, answer: Annotated[str, "The answer provided by the user to the security question"]):
        """Verify the user's security answer."""
        if not self.current_case:
            return "No case loaded. Please ask for username first."
        
        logger.info(f"Verifying answer: {answer}")
        expected = self.current_case.get("securityAnswer", "")
        
        # Simple fuzzy match or exact match
        if answer.lower().strip() in expected.lower().strip() or expected.lower().strip() in answer.lower().strip():
            return "Verification Successful. Proceed to read transaction details."
        else:
            return "Verification Failed. Ask the user to try again or end the call if repeated failures."

    @function_tool
    async def resolve_fraud_case(
        self, 
        context: RunContext, 
        status: Annotated[str, "The final status: 'confirmed_safe' or 'confirmed_fraud'"],
        note: Annotated[str, "A short note about the outcome"]
    ):
        """Update the fraud case status in the database."""
        if not self.current_case:
            return "No case loaded."

        logger.info(f"Resolving case: {status} - {note}")
        
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            cursor.execute('''
                UPDATE fraud_cases 
                SET case_status = ?, outcome_note = ?, last_updated = ?
                WHERE userName = ?
            ''', (status, note, datetime.now().isoformat(), self.current_case["userName"]))
            
            conn.commit()
            conn.close()
            
            # Update local state
            self.current_case["case_status"] = status
            self.current_case["outcome_note"] = note
            
            # Sync back to JSON for visibility
            try:
                conn = sqlite3.connect(DB_PATH)
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM fraud_cases")
                rows = cursor.fetchall()
                conn.close()
                
                json_data = [dict(row) for row in rows]
                with open("fraud_cases.json", "w") as f:
                    json.dump(json_data, f, indent=2)
                logger.info("Synced database changes to fraud_cases.json")
            except Exception as json_e:
                logger.error(f"Error syncing to JSON: {json_e}")

            return "Case updated successfully."
        except Exception as e:
            logger.error(f"Error updating case: {e}")
            return "Error updating database."

    async def on_enter(self, participant=None):
        await self.session.say("Hello, this is Sanket from the Fampay's Fraud Department. I'm calling about a suspicious transaction on your account. To proceed, could you please confirm your username?", allow_interruptions=True)


async def entrypoint(ctx: JobContext):
    logger.info(f"connecting to room {ctx.room.name}")
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    participant = await ctx.wait_for_participant()
    logger.info(f"starting fraud agent for participant {participant.identity}")

    session = AgentSession()
    
    await session.start(
        agent=FraudAlertAgent(),
        room=ctx.room,
    )

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
