"""
==========================================================================
MISSIONOS FASTAPI BACKEND - ADMIN USER MANAGEMENT ROUTER
==========================================================================
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from backend.app.database.user_db import get_db, User
from backend.app.models.response import ApiResponse
from backend.app.models.user import UserResponse
from backend.app.middleware.auth import require_admin

router = APIRouter(prefix="/api/admin", tags=["Admin User Management"], dependencies=[Depends(require_admin)])

class UserStatusUpdateRequest(BaseModel):
    is_active: bool = Field(..., description="Set active or disabled state for user account.")

class AdminUserStats(BaseModel):
    total_users: int
    active_users: int
    inactive_users: int
    admin_count: int

@router.get("/users/stats", response_model=ApiResponse[AdminUserStats])
def get_user_stats(db: Session = Depends(get_db)):
    """
    Get aggregate registration statistics for all users.
    """
    total = db.query(User).count()
    active = db.query(User).filter(User.is_active == True).count()
    inactive = db.query(User).filter(User.is_active == False).count()
    admins = db.query(User).filter(User.role == "admin").count()

    stats = AdminUserStats(
        total_users=total,
        active_users=active,
        inactive_users=inactive,
        admin_count=admins
    )
    return ApiResponse(
        status="success",
        code=200,
        data=stats
    )

@router.get("/users", response_model=ApiResponse[List[UserResponse]])
def list_users(
    search: Optional[str] = Query(None, description="Search by name or email"),
    role: Optional[str] = Query(None, description="Filter by role"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status (active/disabled)"),
    db: Session = Depends(get_db)
):
    """
    Retrieve list of users with search and filtering options.
    """
    query = db.query(User)

    if search:
        search_term = f"%{search}%"
        query = query.filter(User.name.like(search_term) | User.email.like(search_term))

    if role:
        query = query.filter(User.role == role)

    if status_filter:
        if status_filter.lower() == "active":
            query = query.filter(User.is_active == True)
        elif status_filter.lower() == "disabled":
            query = query.filter(User.is_active == False)

    users = query.all()
    user_responses = []
    for u in users:
        user_responses.append(UserResponse(
            id=u.id,
            name=u.name,
            email=u.email,
            created_at=u.created_at.strftime("%Y-%m-%dT%H:%M:%SZ") if hasattr(u.created_at, "strftime") else str(u.created_at),
            last_login=u.last_login.strftime("%Y-%m-%dT%H:%M:%SZ") if u.last_login and hasattr(u.last_login, "strftime") else (str(u.last_login) if u.last_login else None),
            role=u.role,
            avatar=u.avatar,
            is_active=u.is_active
        ))

    return ApiResponse(
        status="success",
        code=200,
        data=user_responses
    )

@router.patch("/users/{user_id}/status", response_model=ApiResponse[UserResponse])
def update_user_status(
    user_id: str,
    payload: UserStatusUpdateRequest,
    db: Session = Depends(get_db)
):
    """
    Enable or disable user login access.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User ID '{user_id}' not found."
        )

    user.is_active = payload.is_active
    db.commit()
    db.refresh(user)

    user_response = UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        created_at=user.created_at.strftime("%Y-%m-%dT%H:%M:%SZ") if hasattr(user.created_at, "strftime") else str(user.created_at),
        last_login=user.last_login.strftime("%Y-%m-%dT%H:%M:%SZ") if user.last_login and hasattr(user.last_login, "strftime") else (str(user.last_login) if user.last_login else None),
        role=user.role,
        avatar=user.avatar,
        is_active=user.is_active
    )

    return ApiResponse(
        status="success",
        code=200,
        message=f"User {user.email} status updated to {'active' if user.is_active else 'disabled'}.",
        data=user_response
    )
