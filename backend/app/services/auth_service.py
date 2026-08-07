"""
==========================================================================
MISSIONOS FASTAPI BACKEND - AUTHENTICATION SERVICE
==========================================================================
"""

import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from backend.app.database.user_db import User
from backend.app.models.user import (
    UserRegisterRequest,
    UserLoginRequest,
    TokenResponse,
    UserResponse,
)
from backend.app.utils.password import hash_password, verify_password
from backend.app.utils.jwt import (
    create_access_token,
    create_refresh_token,
    decode_token,
)


class AuthService:
    

    @staticmethod
    def signup(payload: UserRegisterRequest, db: Session) -> TokenResponse:
        existing_user = db.query(User).filter(User.email == payload.email).first()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email address already exists.",
            )

        new_user = User(
            id=str(uuid.uuid4()),
            name=payload.name,
            email=payload.email,
            hashed_password=hash_password(payload.password),
            created_at=datetime.utcnow(),
            last_login=None,
            role=payload.role or "user",
            avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        user_data = {
            "sub": new_user.email,
            "role": new_user.role,
            "name": new_user.name,
        }

        access_token = create_access_token(user_data)
        refresh_token = create_refresh_token(user_data)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=UserResponse(
                id=str(new_user.id),
                name=new_user.name,
                email=new_user.email,
                created_at=new_user.created_at.strftime("%Y-%m-%dT%H:%M:%SZ") if hasattr(new_user.created_at, "strftime") else str(new_user.created_at),
                last_login=None,
                role=new_user.role,
                avatar=new_user.avatar,
            ),
        )

    @staticmethod
    def login(payload: UserLoginRequest, db: Session) -> TokenResponse:
        user = db.query(User).filter(User.email == payload.email).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        if not verify_password(payload.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        user.last_login = datetime.utcnow()
        db.commit()
        db.refresh(user)

        user_data = {
            "sub": user.email,
            "role": user.role,
            "name": user.name,
        }

        access_token = create_access_token(user_data)
        refresh_token = create_refresh_token(user_data)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=UserResponse(
                id=str(user.id),
                name=user.name,
                email=user.email,
                created_at=user.created_at.strftime("%Y-%m-%dT%H:%M:%SZ") if hasattr(user.created_at, "strftime") else str(user.created_at),
                last_login=user.last_login.strftime("%Y-%m-%dT%H:%M:%SZ") if user.last_login and hasattr(user.last_login, "strftime") else (str(user.last_login) if user.last_login else None),
                role=user.role,
                avatar=user.avatar,
            ),
        )

    @staticmethod
    def refresh(refresh_token: str, db: Session) -> TokenResponse:
        payload = decode_token(refresh_token)

        if not payload or payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token.",
            )

        email = payload.get("sub")

        user = db.query(User).filter(User.email == email).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account no longer exists.",
            )

        user_data = {
            "sub": user.email,
            "role": user.role,
            "name": user.name,
        }

        return TokenResponse(
            access_token=create_access_token(user_data),
            refresh_token=create_refresh_token(user_data),
            token_type="bearer",
            user=UserResponse(
                id=str(user.id),
                name=user.name,
                email=user.email,
                created_at=user.created_at.strftime("%Y-%m-%dT%H:%M:%SZ") if hasattr(user.created_at, "strftime") else str(user.created_at),
                last_login=user.last_login.strftime("%Y-%m-%dT%H:%M:%SZ")
                if user.last_login and hasattr(user.last_login, "strftime")
                else (str(user.last_login) if user.last_login else None),
                role=user.role,
                avatar=user.avatar,
            ),
        )