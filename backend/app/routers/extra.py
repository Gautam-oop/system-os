"""
==========================================================================
MISSIONOS FASTAPI BACKEND - AUXILIARY ROUTERS
==========================================================================
"""

from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from backend.app.models.response import ApiResponse
from backend.app.database.mock_db import db_repo
from backend.app.middleware.auth import get_current_user

router = APIRouter(prefix="/api", tags=["Auxiliary Telemetry"], dependencies=[Depends(get_current_user)])

@router.get("/employees", response_model=ApiResponse[List[Dict[str, Any]]])
def get_employees():
    return ApiResponse(
        data=[
            {
                "id": "emp_001",
                "employeeNumber": "EMP-9401",
                "firstName": "Eleanor",
                "lastName": "Vance",
                "rankTitle": "Director",
                "role": "Engineering Operations Director",
                "department": "Engineering Management",
                "email": "e.vance@missionos.dev",
                "dutyStatus": "ON_DUTY"
            }
        ]
    )

@router.get("/timeline", response_model=ApiResponse[List[Dict[str, Any]]])
def get_timeline():
    return ApiResponse(
        data=[
            {
                "id": "phase-1",
                "name": "Phase I: Core Architecture & Setup",
                "leadAgent": "Titan & Aura",
                "status": "completed",
                "progress": 100,
                "startDay": "Aug 01",
                "endDay": "Aug 04",
                "barLeftPct": 0,
                "barWidthPct": 25,
                "description": "Initial repository setup, design system tokens, and REST API foundation."
            },
            {
                "id": "phase-2",
                "name": "Phase II: UI Redesign & AI Workforce Grid",
                "leadAgent": "Aura (Frontend Lead)",
                "status": "in_progress",
                "progress": 75,
                "startDay": "Aug 04",
                "endDay": "Aug 09",
                "barLeftPct": 25,
                "barWidthPct": 35,
                "description": "Linear-inspired SaaS UI refactoring, team cards, and state management."
            },
            {
                "id": "phase-3",
                "name": "Phase III: CI/CD Pipeline & Security Audit",
                "leadAgent": "Vortex & Cipher",
                "status": "in_progress",
                "progress": 40,
                "startDay": "Aug 07",
                "endDay": "Aug 12",
                "barLeftPct": 45,
                "barWidthPct": 35,
                "description": "Automated deployments, OAuth key rotation, and cypress test automation."
            },
            {
                "id": "phase-4",
                "name": "Phase IV: Production Launch & Analytics",
                "leadAgent": "Nexus Analytics",
                "status": "upcoming",
                "progress": 0,
                "startDay": "Aug 11",
                "endDay": "Aug 15",
                "barLeftPct": 70,
                "barWidthPct": 30,
                "description": "Final load testing, telemetry benchmarking, and production release."
            }
        ]
    )

@router.get("/activity", response_model=ApiResponse[List[Dict[str, Any]]])
def get_activity():
    return ApiResponse(
        data=[
            {
                "id": "evt-1",
                "timestamp": "13:28:04",
                "agentName": "Titan",
                "agentId": "agent-titan",
                "severity": "SUCCESS",
                "message": "Pushed commit to main: Optimized PostgreSQL query indexing for tasks endpoint.",
                "category": "BACKEND"
            },
            {
                "id": "evt-2",
                "timestamp": "13:26:50",
                "agentName": "Cipher",
                "agentId": "agent-cipher",
                "severity": "SUCCESS",
                "message": "Rotated OAuth2 JWT RS256 signing key pair across auth nodes.",
                "category": "SECURITY"
            },
            {
                "id": "evt-3",
                "timestamp": "13:24:12",
                "agentName": "Aura",
                "agentId": "agent-aura",
                "severity": "INFO",
                "message": "Completed accessibility audit. 100% ARIA compliance achieved on task cards.",
                "category": "FRONTEND"
            }
        ]
    )

@router.get("/analytics", response_model=ApiResponse[Dict[str, Any]])
def get_analytics():
    return ApiResponse(
        data={
            "workloadDistribution": [
                { "agent": "Nexus", "percentage": 28, "color": "#ef4444" },
                { "agent": "Titan", "percentage": 24, "color": "#6366f1" },
                { "agent": "Cipher", "percentage": 20, "color": "#10b981" },
                { "agent": "Aura", "percentage": 16, "color": "#06b6d4" },
                { "agent": "Vortex", "percentage": 8, "color": "#f59e0b" },
                { "agent": "Spectre", "percentage": 4, "color": "#3b82f6" }
            ],
            "successRateHistory": [
                { "day": "Aug 01", "rate": 94.2 },
                { "day": "Aug 02", "rate": 96.5 },
                { "day": "Aug 03", "rate": 97.8 },
                { "day": "Aug 04", "rate": 99.4 }
            ],
            "resourceUtilizationHistory": [
                { "time": "12:00", "cpu": 45, "ram": 58, "gpu": 62 },
                { "time": "12:30", "cpu": 60, "ram": 62, "gpu": 78 },
                { "time": "13:00", "cpu": 75, "ram": 65, "gpu": 88 },
                { "time": "13:30", "cpu": 58, "ram": 60, "gpu": 70 }
            ],
            "threatLatencyHistory": [
                { "step": "T-40m", "latencyMs": 24 },
                { "step": "T-30m", "latencyMs": 20 },
                { "step": "T-20m", "latencyMs": 18 },
                { "step": "T-10m", "latencyMs": 15 },
                { "step": "NOW", "latencyMs": 14 }
            ]
        }
    )

@router.post("/mission/defcon", response_model=ApiResponse[Dict[str, Any]])
def trigger_defcon():
    mission = db_repo.get_mission()
    mission["status"] = "Sprint 14 Active Sync"
    return ApiResponse(data=mission)
