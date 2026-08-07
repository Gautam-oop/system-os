from abc import ABC, abstractmethod
from typing import Any, Dict

class LLMProvider(ABC):
    """
    Base class for all LLM Providers.
    Designed to support future providers: OpenAI, Claude, Gemini, DeepSeek, Groq, Llama, Qwen.
    """
    
    @abstractmethod
    def generate(self, role: str, prompt: str, context: Dict[str, Any]) -> str:
        """
        Generate a completion based on the agent's role, prompt, and shared context.
        """
        pass

class MockProvider(LLMProvider):
    """
    A mock provider for local testing without external API calls.
    """
    def generate(self, role: str, prompt: str, context: Dict[str, Any]) -> str:
        return f"[Mock LLM - {role}] Processed prompt: '{prompt}'. Context keys: {list(context.keys())}"
