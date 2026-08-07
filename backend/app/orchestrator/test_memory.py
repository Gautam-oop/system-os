import sys
import os
import json
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

from backend.app.orchestrator.memory import mission_memory

def run_test():
    print("1. Creating Mission...")
    mission = mission_memory.createMission({
        "title": "Migrate Database",
        "description": "Migrate from SQLite to PostgreSQL",
        "status": "pending"
    })
    print(json.dumps(mission, indent=2))
    
    print("\n2. Updating Mission...")
    updated_mission = mission_memory.updateMission({
        "status": "in_progress",
        "priority": "high"
    })
    print(json.dumps(updated_mission, indent=2))

    print("\n3. Saving Agent Output...")
    mission_memory.saveAgentOutput("Backend Engineer", {
        "sql_script": "CREATE TABLE ...",
        "status": "success"
    })
    print("Agent Output Saved.")

    print("\n4. Appending Event...")
    mission_memory.appendEvent({
        "event_type": "MIGRATION_STARTED",
        "message": "Backend Engineer started the migration script."
    })
    print("Event Appended.")

    print("\n5. Appending Decision...")
    mission_memory.appendDecision({
        "decision": "Use Supabase",
        "rationale": "Easier to manage and scales well.",
        "maker": "CEO"
    })
    print("Decision Appended.")

    print("\n6. Getting Complete Mission State...")
    complete_state = mission_memory.getMission()
    print(json.dumps(complete_state, indent=2))

if __name__ == "__main__":
    run_test()
