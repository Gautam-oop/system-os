import asyncio
import json
from typing import AsyncGenerator, Dict, Any

class EventStreamer:
    def __init__(self):
        # List of (queue, loop) tuples for connected listeners
        self.listeners = []

    def publish(self, event: Dict[str, Any]):
        """Push an event to all connected listeners."""
        for queue, loop in self.listeners:
            try:
                # Thread-safe publish since publisher might be in a threadpool
                asyncio.run_coroutine_threadsafe(queue.put(event), loop)
            except Exception:
                pass

    async def subscribe(self) -> AsyncGenerator[str, None]:
        """Subscribe to the event stream (Server-Sent Events)."""
        queue = asyncio.Queue()
        loop = asyncio.get_running_loop()
        self.listeners.append((queue, loop))
        
        try:
            while True:
                event = await queue.get()
                yield f"data: {json.dumps(event)}\n\n"
        except asyncio.CancelledError:
            self.listeners.remove((queue, loop))

# Global streamer instance
streamer = EventStreamer()
