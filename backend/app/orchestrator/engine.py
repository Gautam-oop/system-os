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

import shutil
from backend.app.agents.db_agent import DBAgent
from backend.app.agents.frontend_agent import FrontendEngineerAgent

from backend.app.agents.architect_agent import ArchitectAgent

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
            ArchitectAgent(),
            BackendEngineerAgent(),
            DBAgent(),
            FrontendEngineerAgent(),
            QAAgent()
        ]

    def start_mission(self, mission_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Start the autonomous workforce mission sequence.
        """
        # 1. Mission Created
        self.memory.createMission(mission_data)
        mission_title = mission_data.get("title", mission_data.get("name", "Unknown Mission"))
        mission_id = mission_data.get("id", f"mission_{hash(mission_title)}")
        
        self.memory.appendEvent({
            "event_type": "MISSION_STARTED",
            "message": "Mission Started"
        })
        
        # Shared state dictionary passed across agents
        shared_state: Dict[str, Any] = {}
        
        # 2. Planning Pipeline
        planning_agents = [self.agents[0], self.agents[1], self.agents[2], self.agents[3]] # CEO, PM, Research, Architect
        
        for agent in planning_agents:
            self.memory.appendEvent({
                "event_type": f"{agent.role.upper().replace(' ', '_')}_STARTED",
                "message": f"{agent.role} Started"
            })
            
            llm_response = self.llm_router.generate(
                role=agent.role, 
                prompt=f"Explain your approach for '{mission_title}'. Return ONLY JSON with keys: 'what_doing', 'why_decision', 'needs_from_others'.", 
                context=shared_state
            )
            
            # Emit AGENT_THINKING for planning agents based on llm_trace
            try:
                clean_str = llm_response.strip()
                if clean_str.startswith("```json"): clean_str = clean_str[7:]
                if clean_str.startswith("```"): clean_str = clean_str[3:]
                if clean_str.endswith("```"): clean_str = clean_str[:-3]
                trace_json = json.loads(clean_str.strip())
                self.memory.appendEvent({
                    "event_type": "AGENT_THINKING",
                    "message": f"{agent.role} generated telemetry",
                    "payload": {
                        "agent_name": agent.name,
                        "current_task": trace_json.get("what_doing", ""),
                        "reasoning_summary": trace_json.get("why_decision", ""),
                        "dependencies_needed": [trace_json.get("needs_from_others", "none")],
                        "confidence": 95,
                        "estimated_completion": "N/A"
                    }
                })
            except Exception:
                pass
            
            agent_result = agent.execute(mission_title, shared_state)
            self.memory.saveAgentOutput(agent.role, agent_result)
            
            self.memory.appendEvent({
                "event_type": f"{agent.role.upper().replace(' ', '_')}_FINISHED",
                "message": f"{agent.role} Finished",
                "llm_trace": llm_response,
                "payload": agent_result
            })
            
        # 3. Iterative Execution Manager
        from backend.app.orchestrator.execution_manager import ExecutionManager
        execution_agents = [self.agents[4], self.agents[5], self.agents[6], self.agents[7]] # Backend, DB, Frontend, QA
        
        exec_manager = ExecutionManager(self.memory, execution_agents)
        download_url = exec_manager.execute(mission_title, mission_id, shared_state)
        
        # 3.5 Autonomous Build Execution
        from backend.app.orchestrator.build_manager import BuildManager
        build_manager = BuildManager(self.memory, execution_agents)
        build_manager.execute(mission_title, mission_id, shared_state)
        
        # 4. CEO Final Summary
        self.memory.appendEvent({
            "event_type": "CEO_FINAL_STARTED",
            "message": "CEO Final Summary Started"
        })
        
        ceo = self.agents[0]
        final_summary = ceo.execute(f"Finalize {mission_title} and review generated workspace at {download_url}", shared_state)
        self.memory.saveAgentOutput("CEO_Final", final_summary)
        
        self.memory.appendEvent({
            "event_type": "CEO_FINAL_FINISHED",
            "message": "CEO Final Summary Finished",
            "payload": final_summary
        })
        
        # 5. Mission Completed
        mission_update = {"status": "completed", "download_url": download_url}
        self.memory.updateMission(mission_update)
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
