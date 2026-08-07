import json
from typing import Dict, Any
from backend.app.agents.base_agent import BaseAgent
from backend.app.llm.providers.nvidia_provider import NVIDIAProvider

class ResearchAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="Researcher Nexus", role="Research Analyst")
        self.provider = NVIDIAProvider()

    def execute(self, mission: str, shared_memory: Dict[str, Any]) -> Dict[str, Any]:
        print(f"[{self.role}] Researching requirements for the mission.")
        
        prompt = f"""
        Analyze the mission: '{mission}' and the Project Manager's milestones from the shared memory.
        Conduct a comprehensive market analysis and identify potential competitors, technology recommendations, market insights, risks, and opportunities.

        Return ONLY a raw JSON object with this exact structure:
        {{
            "status": "success",
            "competitor_analysis": ["Competitor A details", "Competitor B details"],
            "technology_recommendations": ["Tech Stack 1", "Tech Stack 2"],
            "market_insights": "A summary of market demand and trends.",
            "risks": ["Market risk 1", "Technical risk 1"],
            "opportunities": ["Opportunity 1", "Opportunity 2"]
        }}
        Do not include markdown blocks or any other text.
        """
        
        fallback = {
            "status": "fallback",
            "competitor_analysis": ["Competitor A", "Competitor B"],
            "technology_recommendations": ["Python", "FastAPI"],
            "market_insights": "High demand for this solution.",
            "risks": ["Market saturation"],
            "opportunities": ["First mover advantage in niche market"]
        }
        
        response = self.generate_with_retry(
            provider=self.provider,
            prompt=prompt,
            context=shared_memory,
            required_keys=["status", "competitor_analysis", "technology_recommendations", "market_insights", "risks", "opportunities"],
            fallback_response=fallback
        )
        
        shared_memory["research_output"] = response
        return response
