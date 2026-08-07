import sys
import os

# Add the root directory to sys.path so we can import backend.app...
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.orchestrator.engine import MissionOrchestrator
from backend.app.orchestrator.memory import mission_memory

def run_test():
    print("Initializing Orchestrator...")
    orchestrator = MissionOrchestrator()
    
    mission_data = {
        "name": "Build a Resume Analyzer",
        "description": "Create an AI system to analyze resumes and output skills.",
        "targetETA": "Aug 15, 2026",
        "leadDirector": "Alpha"
    }
    
    print("\nStarting Mission...")
    orchestrator.start_mission(mission_data)
    
    print("\n--- Final Agent Outputs ---")
    outputs = mission_memory.get_all_outputs()
    for role, output in outputs.items():
        print(f"\n[{role}]")
        print(output)
        
    print("\n--- Mission Events ---")
    for event in mission_memory.events:
        print(f"[{event['timestamp']}] {event['event_type']}: {event['message']}")

if __name__ == "__main__":
    run_test()
