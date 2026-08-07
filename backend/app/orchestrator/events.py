from backend.app.orchestrator.memory import mission_memory

class EventSystem:
    """
    Dispatches and handles lifecycle events during a mission.
    Currently routes events directly to the Shared Mission Memory.
    Can be expanded to use WebSockets or external queues (Redis/Kafka).
    """
    
    @staticmethod
    def dispatch(event_type: str, message: str, severity: str = "INFO"):
        """
        Record an event to the shared memory.
        """
        # We could also log to console or send a websocket message here
        mission_memory.add_event(event_type, message, severity)
        print(f"[{event_type}] {message}")
