"""
==========================================================================
MISSIONOS FASTAPI BACKEND - CONFIGURATION
==========================================================================
"""

from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "missionOS Backend API"
    VERSION: str = "2.4.1-fastapi"
    API_PREFIX: str = "/api"
    ALLOW_ORIGINS: list[str] = ["*"]

settings = Settings()
