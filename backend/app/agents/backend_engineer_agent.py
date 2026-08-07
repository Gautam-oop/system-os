import json
from typing import Dict, Any
from backend.app.agents.base_agent import BaseAgent
from backend.app.llm.router import get_llm_router

class BackendEngineerAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="Backend Titan", role="Backend Engineer")
        self.provider = get_llm_router() # Keep using MockProvider

    def execute(self, mission: str, shared_memory: Dict[str, Any]) -> Dict[str, Any]:
        print(f"[{self.role}] Architecting and building the backend systems.")
        
        prompt = f"""
        Based on the mission: '{mission}', the CEO's directives, and the research context, design the backend architecture.
        Define the core tech stack and the primary API endpoints required to fulfill the milestones.

        Return ONLY a raw JSON object with this exact structure:
        {{
            "status": "success",
            "architecture": "A brief description of the tech stack (e.g. FastAPI with PostgreSQL).",
            "api_endpoints": ["/api/v1/resource1", "/api/v1/resource2"]
        }}
        Do not include markdown blocks or any other text.
        """
        
        fallback = {
            "status": "fallback",
            "architecture": "FastAPI with PostgreSQL.",
            "api_endpoints": ["/api/v1/health", "/api/v1/resource"]
        }
        
        response = self.generate_with_retry(
            provider=self.provider,
            prompt=prompt,
            context=shared_memory,
            required_keys=["status", "architecture", "api_endpoints"],
            fallback_response=fallback
        )
        
        shared_memory["backend_output"] = response
        return response
