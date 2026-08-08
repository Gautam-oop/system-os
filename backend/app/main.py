"""
==========================================================================
MISSIONOS FASTAPI BACKEND - MAIN APPLICATION ENTRYPOINT
==========================================================================
Runs FastAPI web application with CORS middleware, APIRouters, and static files.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.app.config import settings
from backend.app.routers import mission, task, workforce, extra, auth, ai
from backend.app.database.user_db import init_db

# Initialize User SQLite database (creates tables, seeds default user)
init_db()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Clean Architecture FastAPI Backend for missionOS AI Workforce Operating System",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Router Blueprints
app.include_router(auth.router)
app.include_router(mission.router)
app.include_router(task.router)
app.include_router(workforce.router)
app.include_router(extra.router)
app.include_router(ai.router)  # Level 1: First Real AI Connection

# Mount Static Web App Frontend
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if os.path.exists(ROOT_DIR):
    app.mount("/", StaticFiles(directory=ROOT_DIR, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8080, reload=True)
