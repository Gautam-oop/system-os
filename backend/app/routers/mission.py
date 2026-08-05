"""
==========================================================================
MISSIONOS FASTAPI BACKEND - MISSION ROUTER
==========================================================================
"""
from fastapi import APIRouter, HTTPException, status, Depends
from backend.app.models.mission import CreateMissionRequest, MissionResponse
from backend.app.models.response import ApiResponse
from backend.app.database.mock_db import db_repo
from backend.app.middleware.auth import get_current_user

router = APIRouter(prefix="/api", tags=["Missions & Projects"], dependencies=[Depends(get_current_user)])

@router.post("/create-mission", response_model=ApiResponse[MissionResponse], status_code=status.HTTP_201_CREATED)
def create_mission(payload: CreateMissionRequest):
    """
    Create a new project/mission in missionOS.
    Returns generated mission metadata and default objectives.
    """
    mission_dict = db_repo.create_mission(
        name=payload.name,
        description=payload.description,
        target_eta=payload.targetETA,
        director=payload.leadDirector
    )
    return ApiResponse(
        status="success",
        code=201,
        message="Mission created successfully",
        data=MissionResponse(**mission_dict)
    )

@router.get("/mission/{mission_id}", response_model=ApiResponse[MissionResponse])
def get_mission_by_id(mission_id: str):
    """
    Retrieve project/mission payload by unique ID.
    """
    mission_dict = db_repo.get_mission(mission_id)
    if not mission_dict:
        raise HTTPException(status_code=404, detail=f"Mission ID '{mission_id}' not found")
    return ApiResponse(
        status="success",
        code=200,
        data=MissionResponse(**mission_dict)
    )

@router.get("/mission", response_model=ApiResponse[MissionResponse])
def get_default_mission():
    """
    Retrieve current default active project/mission (Project Alpha).
    """
    mission_dict = db_repo.get_mission("prj_9021_alpha")
    if not mission_dict:
        raise HTTPException(status_code=404, detail="Default mission 'prj_9021_alpha' not found")
    return ApiResponse(
        status="success",
        code=200,
        data=MissionResponse(**mission_dict)
    )
