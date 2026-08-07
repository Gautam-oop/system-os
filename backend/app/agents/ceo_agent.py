import json
from typing import Dict, Any
from backend.app.agents.base_agent import BaseAgent
from backend.app.llm.providers.nvidia_provider import NVIDIAProvider

class CEOAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="CEO Alpha", role="CEO")
        # Integrate real NVIDIA provider only for CEO
        self.provider = NVIDIAProvider()

    def execute(self, mission: str, shared_memory: Dict[str, Any]) -> Dict[str, Any]:
        print(f"[{self.role}] Analyzing mission: {mission}")
        
        prompt = f"""
        Analyze this mission: '{mission}'
        
        Return ONLY a raw JSON object with this exact structure:
        {{
            "status": "success",
            "vision": "A brief strategic vision sentence",
            "key_directives": ["Directive 1", "Directive 2", "Directive 3"]
        }}
        Do not include markdown blocks or any other text.
        """
        
        response_str = self.provider.generate(
            role=self.role, 
            prompt=prompt, 
            context=shared_memory
        )
        
        try:
            # Clean up potential markdown formatting if the model disobeys
            clean_str = response_str.strip()
            if clean_str.startswith("```json"):
                clean_str = clean_str[7:]
            if clean_str.startswith("```"):
                clean_str = clean_str[3:]
            if clean_str.endswith("```"):
                clean_str = clean_str[:-3]
                
            response = json.loads(clean_str.strip())
        except Exception as e:
            print(f"[{self.role}] Failed to parse JSON from NVIDIA API: {e}")
            print(f"[{self.role}] Raw response: {response_str}")
            # Fallback to mock if API fails parsing
            response = {
                "status": "fallback",
                "vision": f"Strategic plan for: {mission}",
                "key_directives": ["Focus on modularity", "Ensure testability"]
            }
            
        shared_memory["ceo_output"] = response
        return response
