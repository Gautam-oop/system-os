import json
from typing import Dict, Any
from backend.app.agents.base_agent import BaseAgent
from backend.app.llm.providers.nvidia_provider import NVIDIAProvider

class BackendEngineerAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="Backend Titan", role="Backend Engineer")
        self.provider = NVIDIAProvider()

    def execute(self, mission: str, shared_memory: Dict[str, Any]) -> Dict[str, Any]:
        print(f"[{self.role}] Architecting and building the backend systems.")
        
        prompt = f"""
        Based on the mission: '{mission}', the CEO's directives, and the research context from the shared memory, design the comprehensive backend architecture.
        Define the recommended architecture, primary API endpoints, database schema, tech stack, deployment strategy, and folder structure.

        Return ONLY a raw JSON object with this exact structure:
        {{
            "status": "success",
            "recommended_architecture": "A detailed description of the architectural pattern.",
            "api_endpoints": ["/api/v1/resource1", "/api/v1/resource2"],
            "database_schema": ["Table 1 schema details", "Table 2 schema details"],
            "tech_stack": ["Python", "FastAPI", "PostgreSQL"],
            "deployment_strategy": "A description of how to deploy.",
            "folder_structure": ["src/api", "src/models", "src/services"]
        }}
        Do not include markdown blocks or any other text.
        """
        
        fallback = {
            "status": "fallback",
            "recommended_architecture": "Monolithic architecture.",
            "api_endpoints": ["/api/v1/health"],
            "database_schema": ["users", "items"],
            "tech_stack": ["FastAPI", "SQLite"],
            "deployment_strategy": "Vercel Serverless.",
            "folder_structure": ["app/"]
        }
        
        response = self.generate_with_retry(
            provider=self.provider,
            prompt=prompt,
            context=shared_memory,
            required_keys=["status", "recommended_architecture", "api_endpoints", "database_schema", "tech_stack", "deployment_strategy", "folder_structure"],
            fallback_response=fallback
        )
        
        shared_memory["backend_output"] = response
        return response
