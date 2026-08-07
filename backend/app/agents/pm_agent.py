import json
from typing import Dict, Any
from backend.app.agents.base_agent import BaseAgent
from backend.app.llm.router import get_llm_router

class ProjectManagerAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="PM Tracker", role="Project Manager")
        self.provider = get_llm_router() # Keep using MockProvider

    def execute(self, mission: str, shared_memory: Dict[str, Any]) -> Dict[str, Any]:
        print(f"[{self.role}] Planning execution based on CEO directives.")
        
        prompt = f"""
        Analyze the mission: '{mission}' and the CEO's strategic directives. 
        Create an execution plan with a timeline and concrete milestones.

        Return ONLY a raw JSON object with this exact structure:
        {{
            "status": "success",
            "timeline": "e.g., 2 weeks, 3 months",
            "milestones": ["Milestone 1", "Milestone 2", "Milestone 3"]
        }}
        Do not include markdown blocks or any other text.
        """
        
        fallback = {
            "status": "fallback",
            "timeline": "2 weeks",
            "milestones": ["Requirements Gathering", "Development", "Testing"]
        }
        
        response = self.generate_with_retry(
            provider=self.provider,
            prompt=prompt,
            context=shared_memory,
            required_keys=["status", "timeline", "milestones"],
            fallback_response=fallback
        )
        
        shared_memory["pm_output"] = response
        return response
