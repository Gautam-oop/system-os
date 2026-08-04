"""
==========================================================================
MISSIONOS FASTAPI BACKEND - WORKFORCE (AI TEAMMATES) ROUTER
==========================================================================
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, status
from backend.app.models.workforce import TeammateResponse, UpdateTeammateStatusRequest
from backend.app.models.response import ApiResponse
from backend.app.database.mock_db import db_repo

router = APIRouter(prefix="/api", tags=["AI Workforce & Teammates"])

@router.get("/workforce", response_model=ApiResponse[List[TeammateResponse]])
@router.get("/agents", response_model=ApiResponse[List[TeammateResponse]])
def get_all_teammates():
    """
    Retrieve list of all AI engineering teammates, roles, current tasks, and live statuses.
    """
    workforce_list = db_repo.get_workforce()
    return ApiResponse(
        status="success",
        code=200,
        data=[TeammateResponse(**w) for w in workforce_list]
    )

@router.get("/workforce/{teammate_id}", response_model=ApiResponse[TeammateResponse])
@router.get("/agents/{teammate_id}", response_model=ApiResponse[TeammateResponse])
def get_teammate_by_id(teammate_id: str):
    """
    Retrieve specific AI teammate details by ID.
    """
    teammate = db_repo.get_teammate(teammate_id)
    if not teammate:
        raise HTTPException(status_code=404, detail=f"AI Teammate '{teammate_id}' not found")
    return ApiResponse(
        status="success",
        code=200,
        data=TeammateResponse(**teammate)
    )

@router.patch("/workforce/{teammate_id}/status", response_model=ApiResponse[TeammateResponse])
@router.patch("/agents/{teammate_id}", response_model=ApiResponse[TeammateResponse])
def update_teammate_status(teammate_id: str, payload: Optional[UpdateTeammateStatusRequest] = None):
    """
    Toggle or update active execution status of an AI teammate (e.g. Idle <-> Coding).
    """
    new_status = payload.status if payload else None
    updated = db_repo.toggle_teammate_status(teammate_id, new_status)
    if not updated:
        raise HTTPException(status_code=404, detail=f"AI Teammate '{teammate_id}' not found")
    return ApiResponse(
        status="success",
        code=200,
        message=f"Teammate {teammate_id} status updated",
        data=TeammateResponse(**updated)
    )
