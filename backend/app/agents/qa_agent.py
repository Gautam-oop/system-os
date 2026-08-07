import json
from typing import Dict, Any
from backend.app.agents.base_agent import BaseAgent
from backend.app.llm.providers.nvidia_provider import NVIDIAProvider

class QAAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="QA Spectre", role="QA Engineer")
        self.provider = NVIDIAProvider()

    def execute(self, mission: str, shared_memory: Dict[str, Any]) -> Dict[str, Any]:
        print(f"[{self.role}] Ensuring quality and testing the deliverables.")
        
        prompt = f"""
        Review the proposed backend architecture and API endpoints for mission: '{mission}' from the shared memory.
        Develop a comprehensive testing strategy, including unit tests, integration tests, edge cases, performance checks, security checks, and a coverage estimate.

        Return ONLY a raw JSON object with this exact structure:
        {{
            "status": "success",
            "test_strategy": "A brief description of the overall testing approach.",
            "unit_tests": ["Test 1", "Test 2"],
            "integration_tests": ["Integration Test 1", "Integration Test 2"],
            "edge_cases": ["Edge case 1", "Edge case 2"],
            "performance_checks": ["Check 1", "Check 2"],
            "security_checks": ["Security check 1", "Security check 2"],
            "coverage_estimate": "e.g., 90%"
        }}
        Do not include markdown blocks or any other text.
        """
        
        fallback = {
            "status": "fallback",
            "test_strategy": "Standard E2E and Unit testing.",
            "unit_tests": ["Login test"],
            "integration_tests": ["DB connection test"],
            "edge_cases": ["Invalid input"],
            "performance_checks": ["Load time under 2s"],
            "security_checks": ["SQL injection check"],
            "coverage_estimate": "80%"
        }
        
        response = self.generate_with_retry(
            provider=self.provider,
            prompt=prompt,
            context=shared_memory,
            required_keys=["status", "test_strategy", "unit_tests", "integration_tests", "edge_cases", "performance_checks", "security_checks", "coverage_estimate"],
            fallback_response=fallback
        )
        
        shared_memory["qa_output"] = response
        return response
