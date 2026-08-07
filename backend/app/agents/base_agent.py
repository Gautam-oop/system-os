from abc import ABC, abstractmethod
from typing import Any, Dict

class BaseAgent(ABC):
    """
    Base Agent Framework for MissionOps AI.
    All specialized agents inherit from this base class.
    """
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role
        
    @abstractmethod
    def execute(self, mission: str, shared_memory: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the agent's specific responsibility.
        """
        pass
