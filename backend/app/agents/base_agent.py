import json
from abc import ABC, abstractmethod
from typing import Any, Dict

class BaseAgent(ABC):
    """
    Base Agent Framework for MissionOps AI.
    All specialized agents inherit from this base class.
    """
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role
        
    @abstractmethod
    def execute(self, mission: str, shared_memory: Dict[str, Any], target_file: str = None) -> Dict[str, Any]:
        """
        Execute the agent's specific responsibility.
        """
        pass

    def generate_with_retry(self, provider, prompt: str, context: Dict[str, Any], required_keys: list[str], fallback_response: Dict[str, Any], max_retries: int = 1) -> Dict[str, Any]:
        """
        Helper method to generate JSON, validate schema, and retry on failure.
        """
        current_prompt = prompt
        
        for attempt in range(max_retries + 1):
            response_str = provider.generate(role=self.role, prompt=current_prompt, context=context)
            try:
                # Basic markdown stripping
                clean_str = response_str.strip()
                if clean_str.startswith("```json"): clean_str = clean_str[7:]
                if clean_str.startswith("```"): clean_str = clean_str[3:]
                if clean_str.endswith("```"): clean_str = clean_str[:-3]
                
                parsed = json.loads(clean_str.strip())
                
                # Validate required keys
                missing_keys = [k for k in required_keys if k not in parsed]
                if not missing_keys:
                    return parsed
                    
                raise ValueError(f"Missing required keys: {missing_keys}")
                
            except Exception as e:
                print(f"[{self.role}] Validation failed on attempt {attempt+1}: {e}")
                if attempt == max_retries:
                    print(f"[{self.role}] Returning fallback response.")
                    return fallback_response
                    
                # Correction prompt for the retry
                current_prompt += f"\n\n[SYSTEM] Your last response failed validation: {str(e)}. You must return ONLY raw JSON matching the exact required schema."
                
        return fallback_response
