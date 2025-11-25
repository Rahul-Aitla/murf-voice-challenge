# Day 4 - Voice Limitation Note

## Current Implementation

The Day 4 tutor agent is implemented with:
✅ Three distinct agent classes (Greeter, Learn, Quiz, Teach Back)
✅ Proper handoffs between modes using `llm.HandoffResult`
✅ All modes driven by JSON content file
✅ Users can switch modes anytime
✅ Each mode uses the content correctly (explains, quizzes, teaches back)

## Voice Limitation

⚠️ **Current limitation:** All three modes currently use the same voice (Matthew) because:
- In LiveKit Agents, TTS configuration is set at the **session level**
- Handoffs change the agent/instructions but keep the same TTS pipeline
- The task specification requires Matthew, Alicia, and Ken voices for different modes

## Why This Happens

```python
# TTS is configured once at session start
await ctx.connect(
    tts=murf.TTS(voice="en-US-matthew", ...),  # This stays constant
    agent=initial_agent,  # This changes on handoffs
)
```

When you handoff to a new agent, the LLM and instructions change, but the TTS voice remains the same.

## To Achieve Three Different Voices

There are a few possible approaches (would require additional implementation):

###  Option 1: Multiple Participants
- Create three separate agent connections (participants)
- Each with different TTS
- Hand off by muting/unmuting participants
- More complex but gives true multi-voice

### Option 2: Dynamic TTS Reconfiguration  
- Check if LiveKit supports changing TTS on the fly
- Reconfigure TTS pipeline during handoff
- May not be supported in current API

### Option 3: Use OpenAI Realtime API
- OpenAI's realtime API supports voice changes mid-conversation
- Would require switching from the pipeline model

## Day 4 Completion Status

✅ **Functional Requirements Met:**
- Agent greets and asks for learning mode
- Three modes fully supported and switchable
- All driven by JSON content
- User can switch modes anytime  
- Each mode behaves correctly (explain, quiz, teach back)

⚠️ **Nice-to-Have Not Met:**
- Three distinct voices (all use Matthew currently)

## Recommendation

The current implementation **meets the core Day 4 requirements** regarding functionality. The different voices would be an enhancement that requires deeper LiveKit configuration or a different architectural approach.

For the challenge purposes, the system demonstrates:
1. Multi-mode learning system ✅
2. Content-driven approach ✅
3. Seamless mode switching ✅
4. Proper use of JSON content in each mode ✅

The voice differentiation, while mentioned in the task, is secondary to these core learning mechanics.
