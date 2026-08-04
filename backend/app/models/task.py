"""
==========================================================================
MISSIONOS FASTAPI BACKEND - TASK SCHEMAS
==========================================================================
"""

from typing import List, Optional
from pydantic import BaseModel, Field

class Subtask(BaseModel):
    title: str
    done: bool = False

class CreateTaskRequest(BaseModel):
    title: str = Field(..., example="Refactor API Route Handler")
    priority: str = Field(default="high", example="high")
    assignedAgentId: str = Field(default="agent-aura")
    assignedAgentName: str = Field(default="Aura")
    status: str = Field(default="backlog")
    subtasks: Optional[List[Subtask]] = []

class UpdateTaskStatusRequest(BaseModel):
    status: str = Field(..., example="in_progress")

class TaskResponse(BaseModel):
    id: str
    title: str
    status: str
    priority: str
    assignedAgentId: str
    assignedAgentName: str
    subtasks: List[Subtask] = []
    dueDate: str
