"""
==========================================================================
MISSIONOS FASTAPI BACKEND - USER SCHEMAS
==========================================================================
"""

from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

class UserRegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=50, example="John Doe")
    email: EmailStr = Field(..., example="john.doe@missionops.dev")
    password: str = Field(..., min_length=6, max_length=100, example="securePassword123")
    role: str = Field(default="user", example="user")

class UserLoginRequest(BaseModel):
    email: EmailStr = Field(..., example="admin@missionops.dev")
    password: str = Field(..., example="password123")

class UserResponse(BaseModel):
    id: str = Field(..., example="usr_123456")
    name: str = Field(..., example="John Doe")
    email: str = Field(..., example="john.doe@missionops.dev")
    created_at: str = Field(..., example="2026-08-05T22:15:00Z")
    last_login: Optional[str] = Field(None, example="2026-08-05T22:15:00Z")
    role: str = Field(default="user", example="user")
    avatar: Optional[str] = Field(None, example="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150")
    is_active: bool = Field(default=True, example=True)

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenRefreshRequest(BaseModel):
    refresh_token: str
