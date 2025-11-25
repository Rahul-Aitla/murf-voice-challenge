"""
Tests for Day 4 Teach-the-Tutor Agent
"""

import pytest
import json
from pathlib import Path


# Test content file loading
def test_tutor_content_file_exists():
    """Test that the tutor content file exists and is valid JSON."""
    content_path = Path("shared-data/day4_tutor_content.json")
    assert content_path.exists(), "Tutor content file should exist"
    
    with open(content_path, 'r') as f:
        content = json.load(f)
    
    assert isinstance(content, list), "Content should be a list"
    assert len(content) > 0, "Content should not be empty"


def test_tutor_content_structure():
    """Test that each concept in the content file has the required fields."""
    content_path = Path("shared-data/day4_tutor_content.json")
    
    with open(content_path, 'r') as f:
        content = json.load(f)
    
    required_fields = ['id', 'title', 'summary', 'sample_question']
    
    for concept in content:
        for field in required_fields:
            assert field in concept, f"Concept should have '{field}' field"
            assert concept[field], f"'{field}' should not be empty"


@pytest.mark.asyncio
async def test_greeter_agent_initialization():
    """Test that the GreeterAgent initializes correctly."""
    from tutor_agent import GreeterAgent
    
    agent = GreeterAgent()
    assert agent is not None
    assert agent.instructions is not None
    assert "LEARN mode" in agent.instructions or "learn mode" in agent.instructions.lower()
    assert "QUIZ mode" in agent.instructions or "quiz mode" in agent.instructions.lower()
    assert "TEACH BACK mode" in agent.instructions or "teach back mode" in agent.instructions.lower()


@pytest.mark.asyncio
async def test_learn_mode_agent_initialization():
    """Test that the LearnModeAgent initializes correctly."""
    from tutor_agent import LearnModeAgent
    
    agent = LearnModeAgent()
    assert agent is not None
    assert agent.instructions is not None
    assert "Matthew" in agent.instructions
    assert "LEARN" in agent.instructions or "Learn" in agent.instructions


@pytest.mark.asyncio
async def test_quiz_mode_agent_initialization():
    """Test that the QuizModeAgent initializes correctly."""
    from tutor_agent import QuizModeAgent
    
    agent = QuizModeAgent()
    assert agent is not None
    assert agent.instructions is not None
    assert "Alicia" in agent.instructions
    assert "QUIZ" in agent.instructions or "Quiz" in agent.instructions


@pytest.mark.asyncio
async def test_teachback_mode_agent_initialization():
    """Test that the TeachBackModeAgent initializes correctly."""
    from tutor_agent import TeachBackModeAgent
    
    agent = TeachBackModeAgent()
    assert agent is not None
    assert agent.instructions is not None
    assert "Ken" in agent.instructions
    assert "TEACH BACK" in agent.instructions or "Teach Back" in agent.instructions


@pytest.mark.asyncio
async def test_greeter_handoff_tools():
    """Test that the GreeterAgent has the necessary handoff tools."""
    from tutor_agent import GreeterAgent
    
    agent = GreeterAgent()
    
    # Check that the agent class has the handoff methods
    assert hasattr(agent, 'handoff_to_learn_mode')
    assert hasattr(agent, 'handoff_to_quiz_mode')
    assert hasattr(agent, 'handoff_to_teachback_mode')


@pytest.mark.asyncio
async def test_mode_switching_tools():
    """Test that each mode agent has tools to switch to other modes."""
    from tutor_agent import LearnModeAgent, QuizModeAgent, TeachBackModeAgent
    
    # Learn mode should be able to switch to quiz and teach back
    learn_agent = LearnModeAgent()
    assert hasattr(learn_agent, 'handoff_to_quiz_mode')
    assert hasattr(learn_agent, 'handoff_to_teachback_mode')
    assert hasattr(learn_agent, 'handoff_to_greeter')
    
    # Quiz mode should be able to switch to learn and teach back
    quiz_agent = QuizModeAgent()
    assert hasattr(quiz_agent, 'handoff_to_learn_mode')
    assert hasattr(quiz_agent, 'handoff_to_teachback_mode')
    assert hasattr(quiz_agent, 'handoff_to_greeter')
    
    # Teach back mode should be able to switch to learn and quiz
    teachback_agent = TeachBackModeAgent()
    assert hasattr(teachback_agent, 'handoff_to_learn_mode')
    assert hasattr(teachback_agent, 'handoff_to_quiz_mode')
    assert hasattr(teachback_agent, 'handoff_to_greeter')


@pytest.mark.asyncio 
async def test_content_in_agent_instructions():
    """Test that the tutor content is properly embedded in agent instructions."""
    from tutor_agent import LearnModeAgent, QuizModeAgent, TUTOR_CONTENT
    
    if len(TUTOR_CONTENT) == 0:
        pytest.skip("No tutor content loaded")
    
    # Check that learn mode has concept summaries
    learn_agent = LearnModeAgent()
    for concept in TUTOR_CONTENT:
        assert concept['title'] in learn_agent.instructions
    
    # Check that quiz mode has sample questions
    quiz_agent = QuizModeAgent()
    for concept in TUTOR_CONTENT:
        assert concept['sample_question'] in quiz_agent.instructions
