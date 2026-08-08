"""
==========================================================================
MISSIONOS FASTAPI BACKEND - CONFIGURATION
==========================================================================
Loads environment variables from mission-ops/.env via python-dotenv.
API keys are NEVER serialised into JSON responses or exposed to the browser.
"""

import os
from pydantic import BaseModel
from dotenv import load_dotenv

# Resolve .env path relative to this file's location:
# config.py lives at backend/app/config.py
# .env lives at mission-ops/.env  (two levels up from backend/app/)
_env_path = os.path.join(os.path.dirname(__file__), '..', '..', '.env')
load_dotenv(dotenv_path=_env_path)

class Settings(BaseModel):
    PROJECT_NAME: str = "missionOS Backend API"
    VERSION: str = "2.4.1-fastapi"
    API_PREFIX: str = "/api"
    ALLOW_ORIGINS: list[str] = ["*"]

    # Groq — loaded from .env, NEVER exposed to the browser
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

settings = Settings()
