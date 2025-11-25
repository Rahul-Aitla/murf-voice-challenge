# Day 4 Quick Reference

## 🎯 What Was Built

A **Teach-the-Tutor** AI voice agent with three learning modes:
- **Learn Mode** (Matthew) - Explains programming concepts
- **Quiz Mode** (Alicia) - Tests knowledge with questions
- **Teach Back Mode** (Ken) - Listens and provides feedback

## 📂 Key Files

```
backend/
├── src/
│   └── tutor_agent.py          # Main implementation (441 lines)
├── shared-data/
│   └── day4_tutor_content.json # Content file (5 concepts)
├── tests/
│   └── test_tutor_agent.py     # Test suite (9 tests)
└── conftest.py                 # Pytest config

challenges/
├── DAY4_README.md              # Full documentation
├── DAY4_SUMMARY.md             # Implementation summary
└── DAY4_QUICKREF.md            # This file
```

## 🚀 How to Run

### 1. Start LiveKit Server
```bash
livekit-server --dev
```

### 2. Start the Tutor Agent
```bash
cd backend
uv run python src/tutor_agent.py dev
```

### 3. Start the Frontend
```bash
cd frontend
pnpm dev
```

### 4. Open Browser
Navigate to `http://localhost:3000`

## 🧪 Testing

```bash
cd backend
uv run pytest tests/test_tutor_agent.py -v
```

Expected: **9 tests passing** ✅

## 💬 Usage Examples

### Starting a Session
**Agent:** "Hi! Choose your learning mode: Learn, Quiz, or Teach Back?"  
**You:** "Let's do learn mode"

### Learning
**Agent (Matthew):** "What concept would you like to learn?"  
**You:** "Tell me about variables"  
**Agent:** "Variables are containers that store values..."

### Switching Modes
**You:** "I want to take a quiz now"  
**Agent (Alicia):** "Great! Let's test what you know..."

### Teaching Back
**You:** "I want to try teaching"  
**Agent (Ken):** "I'd love to hear you explain a concept..."

## 🎨 Voice Personas

| Mode | Voice | Style |
|------|-------|-------|
| Greeter | Matthew | Welcoming, guides mode selection |
| Learn | Matthew | Patient tutor, detailed explanations |
| Quiz | Alicia | Enthusiastic, encouraging tester |
| Teach Back | Ken | Supportive mentor, active listener |

## 📚 Concepts Available

1. **Variables** - Storing values in program
2. **Loops** - Repeating code (for, while)
3. **Functions** - Reusable code blocks
4. **Conditionals** - If/else decision making
5. **Arrays** - Collections of values

## 🔧 Extending the Agent

### Add New Concepts

Edit `backend/shared-data/day4_tutor_content.json`:

```json
{
  "id": "new_concept",
  "title": "New Concept",
  "summary": "Detailed explanation...",
  "sample_question": "Question to test understanding?"
}
```

The agents will automatically use the new content!

### Customize Voice Personas

Edit agent instructions in `tutor_agent.py`:

```python
class LearnModeAgent(Agent):
    def __init__(self):
        super().__init__(
            instructions="""Your personalized instructions here..."""
        )
```

### Change Voices

Modify the TTS configuration in `entrypoint()`:

```python
tts=murf.TTS(
    voice="en-US-your-voice-choice",
    style="Conversation",
    ...
)
```

## 🎯 Requirements Checklist

✅ Greeter asks for preferred learning mode  
✅ All three modes (learn, quiz, teach_back) fully supported  
✅ Modes driven by JSON content file  
✅ Users can switch between modes anytime  
✅ Correct voice agent for each mode:
  - Matthew for Learn ✅
  - Alicia for Quiz ✅
  - Ken for Teach Back ✅

## 🏗️ Architecture Highlights

- **Multi-agent system** using LiveKit handoffs
- **Content-driven design** for easy extensibility  
- **Separate sessions** for each voice persona
- **Function tools** for seamless mode switching
- **Test-driven** with comprehensive test coverage

## 📖 Documentation

- **`DAY4_README.md`** - Full guide with examples
- **`DAY4_SUMMARY.md`** - Implementation details
- **`DAY4_QUICKREF.md`** - This quick reference

## 🎉 Status

**Day 4 Challenge: COMPLETE**

All requirements met and tested! 🚀

---

Need help? Check the full documentation in `challenges/DAY4_README.md`
