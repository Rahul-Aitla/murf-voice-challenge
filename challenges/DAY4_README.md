# Day 4: Teach-the-Tutor - Active Recall Coach

## Overview

Day 4 introduces a **Teach-the-Tutor** agent that helps users learn programming concepts through active recall. The agent supports three learning modes, each with a different Murf Falcon voice persona:

- **LEARN mode** (Matthew) - The agent explains concepts in detail
- **QUIZ mode** (Alicia) - The agent asks questions to test understanding  
- **TEACH BACK mode** (Ken) - The user explains concepts back to the agent

## How It Works

### Architecture

The implementation uses **LiveKit Agent handoffs** to create a multi-agent system where each mode is handled by a dedicated agent:

1. **GreeterAgent** - Greets the user and routes them to the chosen mode
2. **LearnModeAgent** - Explains programming concepts (Matthew's voice)
3. **QuizModeAgent** - Tests knowledge with questions (Alicia's voice)
4. **TeachBackModeAgent** - Listens and provides feedback (Ken's voice)

Users can switch between modes at any time during the conversation by simply asking to switch modes.

### Content File

The agent uses a JSON content file (`shared-data/day4_tutor_content.json`) that contains:

- Programming concepts (variables, loops, functions, conditionals, arrays)
- Detailed explanations for each concept
- Sample quiz questions

This design makes it easy to add new concepts or subjects without changing the agent code.

## Files Created

### Backend
- `backend/src/tutor_agent.py` - Main tutor agent with four agent classes
- `backend/shared-data/day4_tutor_content.json` - Content file with programming concepts
- `backend/tests/test_tutor_agent.py` - Comprehensive test suite
- `backend/conftest.py` - Pytest configuration for imports

## Running the Agent

### Option 1: Run the tutor agent directly

```bash
cd backend
uv run python src/tutor_agent.py dev
```

### Option 2: Modify the main entrypoint

To use the tutor agent as your default agent, you can modify `backend/src/agent.py` to import from `tutor_agent.py` instead of using the wellness assistant.

## Testing

Run the test suite to verify everything works:

```bash
cd backend
uv run pytest tests/test_tutor_agent.py -v
```

Tests verify:
- ✅ Content file exists and has valid structure
- ✅ All agents initialize correctly
- ✅ Handoff tools are properly configured
- ✅ Content is embedded in agent instructions
- ✅ Each mode uses the correct voice persona

## Usage Flow

1. **User connects** → GreeterAgent welcomes and explains the three modes
2. **User chooses a mode** → Greeter hands off to the appropriate agent
3. **Learning happens** → User can:
   - Learn new concepts (Learn mode)
   - Test knowledge (Quiz mode)  
   - Teach back concepts (Teach Back mode)
4. **Switch anytime** → User can switch modes by asking

## Example Conversation

**Greeter (Matthew):**
> "Hi! I'm your learning coach. I can help you learn programming in three ways: Learn mode where I explain concepts, Quiz mode where I test you, or Teach Back mode where you explain concepts to me. Which would you like to try?"

**User:**
> "Let's start with learn mode"

**Learn Agent (Matthew):**
> "Great choice! Which concept would you like to learn about? I can explain variables, loops, functions, conditionals, or arrays."

**User:**
> "Tell me about variables"

**Learn Agent (Matthew):**
> "Variables are containers that store values in your program. Think of them like labeled boxes..."

**User:**
> "I want to try the quiz now"

**Quiz Agent (Alicia):**
> "Awesome! Let's test what you know. What is a variable and why is it useful in programming?"

## Voice Personas

- **Matthew** (Greeter & Learn mode) - Patient, knowledgeable tutor
- **Alicia** (Quiz mode) - Enthusiastic quiz master
- **Ken** (Teach Back mode) - Supportive mentor

Each persona uses a different Murf Falcon voice to create distinct experiences.

## Extending the Content

To add new concepts, simply edit `shared-data/day4_tutor_content.json`:

```json
{
  "id": "your_concept_id",
  "title": "Concept Title",
  "summary": "Detailed explanation of the concept...",
  "sample_question": "A question to test understanding"
}
```

The agents will automatically incorporate the new content!

## Key Features

✅ **Three learning modes** - Learn, Quiz, Teach Back  
✅ **Mode switching** - Switch anytime during conversation  
✅ **Different voices** - Each mode has its own persona  
✅ **Content-driven** - Easy to extend with new concepts  
✅ **Handoff-based** - Uses LiveKit agent handoffs for clean architecture  
✅ **Fully tested** - Comprehensive test suite included

## Next Steps

- Add more concepts to the content file
- Customize the instructions for each agent
- Track user progress across sessions
- Add difficulty levels (beginner, intermediate, advanced)
- Integrate with a learning management system

---

**Built for Day 4 of the AI Voice Agents Challenge by murf.ai** 🎤
