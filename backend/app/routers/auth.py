"""
==========================================================================
MISSIONOS FASTAPI BACKEND - AUTHENTICATION ROUTER
==========================================================================
"""

from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.orm import Session

from backend.app.database.user_db import get_db, User
from backend.app.models.response import ApiResponse
from backend.app.models.user import (
    UserRegisterRequest,
    UserLoginRequest,
    UserResponse,
    TokenResponse,
    TokenRefreshRequest
)
from backend.app.services.auth_service import AuthService
from backend.app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/signup")
def signup(payload: UserRegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new user account.
    """
    try:
        token_response = AuthService.signup(payload, db)
        return {
            "status": "success",
            "code": 201,
            "message": "Account created successfully",
            "data": {
                "access_token": token_response.access_token,
                "refresh_token": token_response.refresh_token,
                "token_type": token_response.token_type,
                "user": {
                    "id": token_response.user.id,
                    "name": token_response.user.name,
                    "email": token_response.user.email,
                    "created_at": token_response.user.created_at,
                    "last_login": token_response.user.last_login,
                    "role": token_response.user.role,
                    "avatar": token_response.user.avatar,
                    "is_active": token_response.user.is_active
                }
            }
        }
    except Exception as e:
        import traceback
        return {
            "status": "error",
            "code": 400,
            "message": f"Signup failed: {str(e)}",
            "detail": traceback.format_exc()
        }

@router.post("/login", response_model=ApiResponse[TokenResponse])
def login(payload: UserLoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate user and return a token payload.
    """
    try:
        token_response = AuthService.login(payload, db)
        return ApiResponse(
            status="success",
            code=200,
            message="Login successful",
            data=token_response
        )
    except Exception as e:
        import traceback
        raise HTTPException(
            status_code=400,
            detail=f"Login failed: {str(e)} | Traceback: {traceback.format_exc()}"
        )

@router.post("/logout", response_model=ApiResponse[str])
def logout(current_user: User = Depends(get_current_user)):
    """
    Log out of the current session (client should delete tokens).
    """
    return ApiResponse(
        status="success",
        code=200,
        message="Logout successful",
        data=f"Session revoked for user {current_user.email}"
    )

@router.get("/me", response_model=ApiResponse[UserResponse])
def get_me(current_user: User = Depends(get_current_user)):
    """
    Retrieve authenticated user profile.
    """
    user_response = UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        created_at=current_user.created_at.strftime("%Y-%m-%dT%H:%M:%SZ"),
        last_login=current_user.last_login.strftime("%Y-%m-%dT%H:%M:%SZ") if current_user.last_login else None,
        role=current_user.role,
        avatar=current_user.avatar
    )
    return ApiResponse(
        status="success",
        code=200,
        data=user_response
    )

@router.post("/refresh", response_model=ApiResponse[TokenResponse])
def refresh_token(payload: TokenRefreshRequest, db: Session = Depends(get_db)):
    """
    Exchange refresh token for a new set of access/refresh tokens.
    """
    token_response = AuthService.refresh(payload.refresh_token, db)
    return ApiResponse(
        status="success",
        code=200,
        message="Tokens refreshed successfully",
        data=token_response
    )
