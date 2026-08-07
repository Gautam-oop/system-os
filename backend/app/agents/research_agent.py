import json
from typing import Dict, Any
from backend.app.agents.base_agent import BaseAgent
from backend.app.llm.router import get_llm_router

class ResearchAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="Researcher Nexus", role="Research Analyst")
        self.provider = get_llm_router() # Keep using MockProvider

    def execute(self, mission: str, shared_memory: Dict[str, Any]) -> Dict[str, Any]:
        print(f"[{self.role}] Researching requirements for the mission.")
        
        prompt = f"""
        Analyze the mission: '{mission}' and the Project Manager's milestones.
        Conduct a mock market analysis and identify potential competitors or comparable products.

        Return ONLY a raw JSON object with this exact structure:
        {{
            "status": "success",
            "market_analysis": "A brief summary of market demand and viability.",
            "competitors": ["Competitor A", "Competitor B"]
        }}
        Do not include markdown blocks or any other text.
        """
        
        fallback = {
            "status": "fallback",
            "market_analysis": "High demand for this solution.",
            "competitors": ["Competitor A", "Competitor B"]
        }
        
        response = self.generate_with_retry(
            provider=self.provider,
            prompt=prompt,
            context=shared_memory,
            required_keys=["status", "market_analysis", "competitors"],
            fallback_response=fallback
        )
        
        shared_memory["research_output"] = response
        return response
