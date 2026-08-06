"""
==========================================================================
MISSIONOS FASTAPI BACKEND - MISSION SCHEMAS
==========================================================================
"""

from typing import List, Optional
from pydantic import BaseModel, Field

class MissionObjective(BaseModel):
    id: str
    code: str
    name: str
    progressPercentage: int = Field(alias="progress", default=0)
    status: str = "IN_PROGRESS"
    leadAgentId: str = "Aura (Frontend Lead)"

    class Config:
        populate_by_name = True

class CreateMissionRequest(BaseModel):
    name: str = Field(..., example="SaaS OS")
    description: str = Field(..., example="Next-gen AI workforce operating system")
    targetETA: str = Field(default="Aug 15, 2026")
    leadDirector: str = Field(default="Eleanor Vance")

class MissionResponse(BaseModel):
    id: str
    codeName: str
    name: str
    status: str
    commanderId: str = "emp_001"
    startedAt: str
    targetETA: str
    overallProgress: int
    activeMembersCount: int
    completedTasksCount: int
    pendingTasksCount: int
    currentSprint: str
    sprintDaysRemaining: int
    description: str
    objectives: List[MissionObjective]
