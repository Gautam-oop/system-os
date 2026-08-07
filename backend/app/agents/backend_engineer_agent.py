import json
from typing import Dict, Any
from backend.app.agents.base_agent import BaseAgent
from backend.app.llm.providers.nvidia_provider import NVIDIAProvider

class BackendEngineerAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="Backend Titan", role="Backend Engineer")
        self.provider = NVIDIAProvider()

    def execute(self, mission: str, shared_memory: Dict[str, Any], target_file: str = None) -> Dict[str, Any]:
        if target_file:
            print(f"[{self.role}] Generating specific file: {target_file}")
            prompt = f"""
            Based on the mission: '{mission}' and the architect's blueprint, generate the production-ready source code ONLY for the file '{target_file}'.
            Return ONLY a raw JSON object with this exact structure:
            {{
                "status": "success",
                "telemetry": {{
                    "agent_name": "{self.name}",
                    "current_task": "Generating {target_file}",
                    "reasoning_summary": "I am implementing...",
                    "dependencies_needed": ["none"],
                    "confidence": 95,
                    "estimated_completion": "2s"
                }},
                "files": {{
                    "{target_file}": "from fastapi import ..."
                }}
            }}
            Do not include markdown blocks or any other text.
            """
        else:
            print(f"[{self.role}] Architecting and building the backend systems.")
            prompt = f"""
            Based on the mission: '{mission}', the CEO's directives, and the architect's blueprint from the shared memory, generate a comprehensive production-ready FastAPI backend architecture.
            Optimize the backend specifically for an AI application (e.g., Resume Analyzer, Document Intelligence).

            You MUST provide the actual source code files needed to run the backend.

            Return ONLY a raw JSON object with this exact structure:
            {{
                "status": "success",
                "telemetry": {{
                    "agent_name": "{self.name}",
                    "current_task": "Architecting backend systems",
                    "reasoning_summary": "I am structuring the backend according to the blueprint...",
                    "dependencies_needed": ["Frontend", "Database"],
                    "confidence": 95,
                    "estimated_completion": "10s"
                }},
                "files": {{
                    "backend/main.py": "from fastapi import ...",
                    "backend/requirements.txt": "fastapi\\nuvicorn\\n..."
                }}
            }}
            Do not include markdown blocks or any other text.
            """
        
        fallback = {
            "status": "fallback",
            "telemetry": {
                "agent_name": self.name,
                "current_task": "Fallback task",
                "reasoning_summary": "Fell back due to validation errors.",
                "dependencies_needed": [],
                "confidence": 0,
                "estimated_completion": "0s"
            },
            "files": {
                target_file if target_file else "backend/main.py": "# Backend code..."
            }
        }
        
        response = self.generate_with_retry(
            provider=self.provider,
            prompt=prompt,
            context=shared_memory,
            required_keys=["status", "telemetry", "files"],
            fallback_response=fallback
        )
        
        return response
