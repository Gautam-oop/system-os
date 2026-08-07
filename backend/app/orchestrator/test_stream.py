import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

import asyncio
import threading
import time
from backend.app.orchestrator.engine import MissionOrchestrator
from backend.app.orchestrator.streamer import streamer

async def listen_to_stream():
    print("[Listener] Subscribing to SSE stream...")
    count = 0
    # Add a small delay to ensure listener connects before mission finishes instantly
    await asyncio.sleep(0.1) 
    
    async for event in streamer.subscribe():
        print(f"[Stream Received] {event.strip()}")
        count += 1
        if "MISSION_COMPLETED" in event:
            break
    print(f"[Listener] Received {count} events. Exiting.")

def run_mission():
    time.sleep(0.2) # Wait for listener to connect
    print("[Thread] Starting Mission Orchestrator...")
    orchestrator = MissionOrchestrator()
    orchestrator.start_mission({"title": "Streaming Test Mission"})
    print("[Thread] Mission Orchestrator finished.")

async def main():
    # Start mission in background thread
    threading.Thread(target=run_mission).start()
    
    # Listen to stream in main asyncio loop
    await listen_to_stream()

if __name__ == "__main__":
    asyncio.run(main())
