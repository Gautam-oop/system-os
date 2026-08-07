import json
from typing import Dict, Any
from backend.app.agents.base_agent import BaseAgent
from backend.app.llm.router import get_llm_router

class QAAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="QA Spectre", role="QA Engineer")
        self.provider = get_llm_router() # Keep using MockProvider

    def execute(self, mission: str, shared_memory: Dict[str, Any]) -> Dict[str, Any]:
        print(f"[{self.role}] Ensuring quality and testing the deliverables.")
        
        prompt = f"""
        Review the proposed backend architecture and API endpoints for mission: '{mission}'.
        Develop a testing strategy, specifying the test plan and the target code coverage percentage.

        Return ONLY a raw JSON object with this exact structure:
        {{
            "status": "success",
            "test_plan": "A brief description of the testing approach (e.g. E2E with Cypress).",
            "coverage_target": "e.g., 90%"
        }}
        Do not include markdown blocks or any other text.
        """
        
        fallback = {
            "status": "fallback",
            "test_plan": "E2E testing with Cypress, Unit tests with Pytest.",
            "coverage_target": "90%"
        }
        
        response = self.generate_with_retry(
            provider=self.provider,
            prompt=prompt,
            context=shared_memory,
            required_keys=["status", "test_plan", "coverage_target"],
            fallback_response=fallback
        )
        
        shared_memory["qa_output"] = response
        return response
