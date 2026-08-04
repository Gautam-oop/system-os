"""
==========================================================================
MISSIONOS FASTAPI BACKEND - WORKFORCE (AI TEAMMATE) SCHEMAS
==========================================================================
"""

from typing import List, Optional
from pydantic import BaseModel, Field

class UpdateTeammateStatusRequest(BaseModel):
    status: Optional[str] = Field(None, example="Coding")

class TeammateResponse(BaseModel):
    id: str
    code: str
    name: str
    role: str
    status: str
    avatarBg: str
    avatarColor: str
    progress: int
    tasksCompleted: int
    activeOperation: Optional[str] = None
    currentTask: Optional[str] = None
    capabilities: List[str] = []
    lastActive: str
