import sys
import os
import json
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

from typing import Dict, Any
from backend.app.orchestrator.memory import SharedMissionMemory
from backend.app.agents.ceo_agent import CEOAgent
from backend.app.agents.pm_agent import ProjectManagerAgent
from backend.app.agents.research_agent import ResearchAgent
from backend.app.agents.backend_engineer_agent import BackendEngineerAgent
from backend.app.agents.qa_agent import QAAgent
from backend.app.llm.router import get_llm_router

class MissionOrchestrator:
    """
    Controls the execution sequence of the autonomous AI workforce.
    """
    def __init__(self):
        self.memory = SharedMissionMemory()
        self.llm_router = get_llm_router()
        
        # Instantiate the workforce
        self.agents = [
            CEOAgent(),
            ProjectManagerAgent(),
            ResearchAgent(),
            BackendEngineerAgent(),
            QAAgent()
        ]

    def start_mission(self, mission_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Start the autonomous workforce mission sequence.
        Workflow: Mission Created -> CEO -> Project Manager -> Research -> Backend -> QA -> CEO Final Summary
        """
        # 1. Mission Created
        self.memory.createMission(mission_data)
        mission_title = mission_data.get("title", mission_data.get("name", "Unknown Mission"))
        
        self.memory.appendEvent({
            "event_type": "MISSION_STARTED",
            "message": "Mission Started"
        })
        
        # Shared state dictionary passed across agents
        shared_state: Dict[str, Any] = {}
        
        # 2. Sequential Execution Pipeline
        for agent in self.agents:
            # Generate execution event BEFORE the step
            self.memory.appendEvent({
                "event_type": f"{agent.role.upper().replace(' ', '_')}_STARTED",
                "message": f"{agent.role} Started"
            })
            
            # Ask LLM Router for contextual generation (Mocked for now)
            llm_response = self.llm_router.generate(
                role=agent.role, 
                prompt=f"Execute step for mission: {mission_title}", 
                context=shared_state
            )
            
            # Execute agent logic (which updates shared_state in-place)
            agent_result = agent.execute(mission_title, shared_state)
            
            # Save the result explicitly to memory's agent_outputs store
            self.memory.saveAgentOutput(agent.role, agent_result)
            
            # Generate execution event AFTER the step
            self.memory.appendEvent({
                "event_type": f"{agent.role.upper().replace(' ', '_')}_FINISHED",
                "message": f"{agent.role} Finished",
                "llm_trace": llm_response,
                "payload": agent_result
            })
            
        # 3. CEO Final Summary
        self.memory.appendEvent({
            "event_type": "CEO_FINAL_STARTED",
            "message": "CEO Final Summary Started"
        })
        
        ceo = self.agents[0]
        final_summary = ceo.execute(f"Finalize {mission_title}", shared_state)
        self.memory.saveAgentOutput("CEO_Final", final_summary)
        
        self.memory.appendEvent({
            "event_type": "CEO_FINAL_FINISHED",
            "message": "CEO Final Summary Finished",
            "payload": final_summary
        })
        
        # 4. Mission Completed
        self.memory.updateMission({"status": "completed"})
        self.memory.appendEvent({
            "event_type": "MISSION_COMPLETED",
            "message": "Mission Completed"
        })
        
        return self.memory.getMission()

if __name__ == "__main__":
    orchestrator = MissionOrchestrator()
    mission_payload = {
        "title": "Migrate Database",
        "description": "Migrate from SQLite to PostgreSQL",
        "status": "pending"
    }
    
    print("Starting Mission Orchestrator...\n")
    result = orchestrator.start_mission(mission_payload)
    print("\nFinal Mission State:")
    print(json.dumps(result, indent=2))
