from typing import Dict, Any, Optional
from backend.app.llm.provider import LLMProvider, MockProvider

class LLMRouter:
    """
    Routes LLM requests to the configured active provider.
    Agents interact with this router, not the underlying providers.
    """
    
    def __init__(self, provider: LLMProvider):
        self.provider = provider
        
    def set_provider(self, provider: LLMProvider):
        """Switch the underlying provider dynamically."""
        self.provider = provider
        
    def generate(self, role: str, prompt: str, context: Dict[str, Any]) -> str:
        """
        The single exposed interface for LLM generation.
        """
        return self.provider.generate(role, prompt, context)

# Global LLM Router instance initialized with MockProvider by default for now
_router_instance: Optional[LLMRouter] = LLMRouter(MockProvider())

def get_llm_router() -> LLMRouter:
    global _router_instance
    if _router_instance is None:
        raise ValueError("LLMRouter has not been initialized with a provider yet.")
    return _router_instance

def init_llm_router(provider: LLMProvider):
    global _router_instance
    _router_instance = LLMRouter(provider)
