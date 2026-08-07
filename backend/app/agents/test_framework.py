import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

from backend.app.agents.ceo_agent import CEOAgent
from backend.app.agents.pm_agent import ProjectManagerAgent
from backend.app.agents.research_agent import ResearchAgent
from backend.app.agents.backend_engineer_agent import BackendEngineerAgent
from backend.app.agents.qa_agent import QAAgent

def run_test():
    mission = "Build a scalable microservices architecture."
    shared_memory = {}

    agents = [
        CEOAgent(),
        ProjectManagerAgent(),
        ResearchAgent(),
        BackendEngineerAgent(),
        QAAgent()
    ]

    print(f"Starting Mission: {mission}\n")

    for agent in agents:
        print(f"--- Executing {agent.role} ({agent.name}) ---")
        agent.execute(mission, shared_memory)
        
    print("\nFinal Shared Memory State:")
    import json
    print(json.dumps(shared_memory, indent=2))

if __name__ == "__main__":
    run_test()
