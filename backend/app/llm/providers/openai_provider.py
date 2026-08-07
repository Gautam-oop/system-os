from typing import Any, Dict
import json
from backend.app.llm.provider import LLMProvider

class OpenAIProvider(LLMProvider):
    """
    Mock implementation of the OpenAI Provider for local development.
    Replace with actual OpenAI python SDK calls when integrating.
    """
    
    def __init__(self, api_key: str = "mock-key", model: str = "gpt-4-turbo"):
        self.api_key = api_key
        self.model = model
        
    def generate_completion(self, prompt: str, **kwargs) -> str:
        # Mock LLM logic
        return f"[Mock OpenAI {self.model} Completion] Received prompt: {prompt[:50]}..."

    def generate_json(self, prompt: str, schema: Dict[str, Any], **kwargs) -> Dict[str, Any]:
        # Mock structured logic. Ideally we would parse the schema and return a dummy.
        # For now, just returning a placeholder dict matching common agent outputs.
        return {
            "status": "success",
            "mock_data": True,
            "provider": f"OpenAI-{self.model}",
            "summary": "This is a mock structured response."
        }
