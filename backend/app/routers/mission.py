"""
==========================================================================
MISSIONOS FASTAPI BACKEND - MISSION ROUTER
==========================================================================
"""
from fastapi import APIRouter, HTTPException, status, Depends
from typing import Dict, Any
from fastapi.responses import StreamingResponse
from backend.app.models.mission import CreateMissionRequest, MissionResponse
from backend.app.models.response import ApiResponse
from backend.app.database.mock_db import db_repo
from backend.app.middleware.auth import get_current_user
from backend.app.orchestrator.streamer import streamer

router = APIRouter(prefix="/api", tags=["Missions & Projects"])

@router.get("/stream")
async def stream_mission_events():
    """
    Stream real-time mission execution events via SSE.
    """
    return StreamingResponse(streamer.subscribe(), media_type="text/event-stream")

@router.post("/create-mission", response_model=ApiResponse[MissionResponse], status_code=status.HTTP_201_CREATED, dependencies=[Depends(get_current_user)])
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
    Retrieve current default active project/mission (SaaS OS).
    """
    mission_dict = db_repo.get_mission("prj_9021_alpha")
    if not mission_dict:
        raise HTTPException(status_code=404, detail="Default mission 'prj_9021_alpha' not found")
    return ApiResponse(
        status="success",
        code=200,
        data=MissionResponse(**mission_dict)
    )

@router.post("/mission/run", response_model=ApiResponse[Dict[str, Any]])
def run_mission(payload: CreateMissionRequest):
    """
    Execute the entire autonomous AI workforce mission workflow.
    """
    from backend.app.orchestrator.engine import MissionOrchestrator
    
    orchestrator = MissionOrchestrator()
    mission_data = {
        "name": payload.name,
        "description": payload.description,
        "targetETA": payload.targetETA,
        "leadDirector": payload.leadDirector
    }
    
    try:
        final_outputs = orchestrator.start_mission(mission_data)
        return ApiResponse(
            status="success",
            code=200,
            message="Mission executed successfully",
            data=final_outputs
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Mission execution failed: {str(e)}")

@router.get("/download/{mission_id}")
def download_workspace(mission_id: str):
    """
    Download the generated source code workspace for a mission.
    """
    import os
    from fastapi.responses import FileResponse
    
    zip_path = os.path.abspath(os.path.join(os.path.dirname(__file__), f"../../../backend/workspace/{mission_id}.zip"))
    if not os.path.exists(zip_path):
        raise HTTPException(status_code=404, detail="Workspace archive not found or still generating.")
        
    return FileResponse(zip_path, media_type="application/zip", filename=f"{mission_id}.zip")
