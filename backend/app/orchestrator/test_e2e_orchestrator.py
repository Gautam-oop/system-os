import sys
import os
import json
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

from backend.app.orchestrator.engine import MissionOrchestrator

def run_e2e_test():
    mission_payload = {
        "title": "Build a Resume Analyzer",
        "description": "An AI tool that parses resumes and extracts key skills.",
        "status": "pending"
    }

    print("\n" + "="*50)
    print("STARTING END-TO-END ORCHESTRATOR TEST")
    print("MISSION: Build a Resume Analyzer")
    print("="*50 + "\n")

    orchestrator = MissionOrchestrator()
    
    # Run the mission
    final_state = orchestrator.start_mission(mission_payload)
    
    # 1. Print Execution Order (extracted from events)
    print("\n--- EXECUTION ORDER ---")
    events = final_state.get("events", [])
    for event in events:
        print(f"[{event['timestamp']}] {event['event_type']}: {event['message']}")

    # 2. Print Generated Events Array (Raw JSON)
    print("\n--- GENERATED EVENTS (JSON) ---")
    print(json.dumps(events, indent=2))

    # 3. Print Final Shared Memory
    print("\n--- FINAL SHARED MEMORY ---")
    print(json.dumps(final_state, indent=2))
    
    print("\n" + "="*50)
    print("END-TO-END ORCHESTRATOR TEST COMPLETED")
    print("="*50 + "\n")

if __name__ == "__main__":
    run_e2e_test()
