import json
from typing import Dict, Any
from backend.app.agents.base_agent import BaseAgent
from backend.app.llm.providers.nvidia_provider import NVIDIAProvider

class QAAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="QA Spectre", role="QA Engineer")
        self.provider = NVIDIAProvider()

    def execute(self, mission: str, shared_memory: Dict[str, Any], target_file: str = None) -> Dict[str, Any]:
        if target_file:
            print(f"[{self.role}] Generating specific test file: {target_file}")
            prompt = f"""
            Based on the mission: '{mission}' and the blueprint, generate ONLY the test source code for the file '{target_file}'.
            Return ONLY a raw JSON object with this exact structure:
            {{
                "status": "success",
                "telemetry": {{
                    "agent_name": "{self.name}",
                    "current_task": "Generating test {target_file}",
                    "reasoning_summary": "I am writing Pytest assertions...",
                    "dependencies_needed": ["none"],
                    "confidence": 92,
                    "estimated_completion": "4s"
                }},
                "files": {{
                    "{target_file}": "import pytest..."
                }}
            }}
            Do not include markdown blocks or any other text.
            """
        else:
            print(f"[{self.role}] Ensuring quality and testing the deliverables.")
            prompt = f"""
            Review the proposed blueprint for mission: '{mission}'.
            Develop a comprehensive testing suite using Pytest for the backend endpoints.

            Return ONLY a raw JSON object with this exact structure:
            {{
                "status": "success",
                "telemetry": {{
                    "agent_name": "{self.name}",
                    "current_task": "Developing test suite",
                    "reasoning_summary": "I am ensuring high test coverage for all routes.",
                    "dependencies_needed": ["Backend implementation"],
                    "confidence": 90,
                    "estimated_completion": "10s"
                }},
                "files": {{
                    "backend/tests/test_main.py": "import pytest..."
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
                target_file if target_file else "backend/tests/test_fallback.py": "def test_ok(): pass"
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
