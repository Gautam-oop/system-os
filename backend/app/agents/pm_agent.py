from typing import Dict, Any
from backend.app.agents.base_agent import BaseAgent

class ProjectManagerAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="PM Tracker", role="Project Manager")

    def execute(self, mission: str, shared_memory: Dict[str, Any]) -> Dict[str, Any]:
        ceo_output = shared_memory.get("ceo_output", {})
        print(f"[{self.role}] Planning execution based on CEO directives.")
        
        # Mock responses
        response = {
            "status": "success",
            "timeline": "2 weeks",
            "milestones": ["Requirements Gathering", "Development", "Testing"]
        }
        shared_memory["pm_output"] = response
        return response
