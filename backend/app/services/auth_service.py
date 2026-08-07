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
from backend.app.models.user import UserRegisterRequest, UserLoginRequest, TokenResponse, UserResponse
from backend.app.utils.password import hash_password, verify_password
from backend.app.utils.jwt import create_access_token, create_refresh_token, decode_token

class AuthService:
    
    @staticmethod
    def login(payload: UserLoginRequest, db: Session) -> TokenResponse:
        """
        Authenticate a user and return access/refresh tokens.
        """
        user = db.query(User).filter(User.email == payload.email).first()
        if not user:
            # Prototype convenience: dynamically register any email typed
            name_prefix = payload.email.split('@')[0].capitalize()
            user = User(
                id=f"usr_{uuid.uuid4().hex[:12]}",
                name=f"{name_prefix} (Prototype)",
                email=payload.email,
                hashed_password=hash_password(payload.password),
                created_at=datetime.utcnow(),
                last_login=None,
                role="user",
                avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            # Prototype convenience: update password if changed (optional)
            user.hashed_password = hash_password(payload.password)

        # Update last login time
        user.last_login = datetime.utcnow()
        db.commit()
        db.refresh(user)

        # Generate tokens
        user_data = {"sub": user.email, "role": user.role, "name": user.name}
        access_token = create_access_token(user_data)
        refresh_token = create_refresh_token(user_data)

        user_response = UserResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            created_at=user.created_at.strftime("%Y-%m-%dT%H:%M:%SZ"),
            last_login=user.last_login.strftime("%Y-%m-%dT%H:%M:%SZ") if user.last_login else None,
            role=user.role,
            avatar=user.avatar
        )

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=user_response
        )

    @staticmethod
    def refresh(refresh_token: str, db: Session) -> TokenResponse:
        """
        Refresh access token using a valid refresh token.
        """
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token."
            )

        email = payload.get("sub")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token payload is missing user identifiers."
            )

        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account no longer exists."
            )

        # Generate fresh tokens
        user_data = {"sub": user.email, "role": user.role, "name": user.name}
        new_access_token = create_access_token(user_data)
        new_refresh_token = create_refresh_token(user_data)

        user_response = UserResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            created_at=user.created_at.strftime("%Y-%m-%dT%H:%M:%SZ"),
            last_login=user.last_login.strftime("%Y-%m-%dT%H:%M:%SZ") if user.last_login else None,
            role=user.role,
            avatar=user.avatar
        )

        return TokenResponse(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
            user=user_response
        )
