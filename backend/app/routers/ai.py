"""
==========================================================================
MISSIONOPS FASTAPI BACKEND - AI ROUTER (LEVEL 1: FIRST REAL AI CONNECTION)
==========================================================================
Endpoints:
  POST /api/ai/test   — General connectivity test against Gemini
  POST /api/ai/task   — Role-specific task execution

The Gemini API key is NEVER exposed to the browser or JavaScript.
"""

from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field

from backend.app.services.groq_service import GroqService
from backend.app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/ai", tags=["AI — Level 1"], dependencies=[Depends(get_current_user)])

# ──────────────────────────────────────────────────────────────────────────────
# REQUEST / RESPONSE MODELS
# ──────────────────────────────────────────────────────────────────────────────

class AITestRequest(BaseModel):
    prompt: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="The prompt to send to Gemini."
    )

class AITestResponse(BaseModel):
    success: bool
    response: str
    model: str

class AITaskRequest(BaseModel):
    task: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="The task description to hand to the AI role."
    )
    role: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="The AI agent role to adopt (e.g., 'Research Analyst')."
    )

class AITaskResponse(BaseModel):
    success: bool
    role: str
    task: str
    result: str
    model: str

# ──────────────────────────────────────────────────────────────────────────────
# SYSTEM PROMPTS
# ──────────────────────────────────────────────────────────────────────────────

_DEFAULT_SYSTEM_PROMPT = (
    "You are MissionOps AI, an expert AI assistant integrated into the MissionOps "
    "workforce operating system. Provide clear, professional, and concise responses. "
    "Do not expose internal implementation details."
)

def _build_role_system_prompt(role: str) -> str:
    """Return a role-specific system prompt for the MissionOps AI workforce."""
    role_lower = role.lower().strip()

    role_map = {
        "research analyst": (
            "You are the Research Analyst in MissionOps AI. "
            "Your responsibility is research and analysis. "
            "Return structured findings that another AI worker could use. "
            "Do not perform unrelated responsibilities. "
            "Format your response with clear sections: Summary, Key Findings, and Recommendations."
        ),
        "project manager": (
            "You are the Project Manager in MissionOps AI. "
            "Your responsibility is planning, scheduling, and coordinating tasks. "
            "Return a structured plan with milestones, owners, and timelines. "
            "Do not perform unrelated responsibilities."
        ),
        "backend engineer": (
            "You are the Backend Engineer in MissionOps AI. "
            "Your responsibility is designing and implementing server-side architecture, "
            "REST APIs, and database schemas. "
            "Return structured technical findings and implementation recommendations. "
            "Do not perform unrelated responsibilities."
        ),
        "frontend engineer": (
            "You are the Frontend Engineer in MissionOps AI. "
            "Your responsibility is designing and implementing UI components, "
            "state management, and client-side architecture. "
            "Return structured technical findings and code recommendations. "
            "Do not perform unrelated responsibilities."
        ),
        "ui/ux designer": (
            "You are the UI/UX Designer in MissionOps AI. "
            "Your responsibility is user research, wireframes, and design systems. "
            "Return structured UX findings and design recommendations. "
            "Do not perform unrelated responsibilities."
        ),
        "qa engineer": (
            "You are the QA Engineer in MissionOps AI. "
            "Your responsibility is testing, quality assurance, and bug analysis. "
            "Return structured test plans, test cases, and quality recommendations. "
            "Do not perform unrelated responsibilities."
        ),
        "devops engineer": (
            "You are the DevOps Engineer in MissionOps AI. "
            "Your responsibility is CI/CD pipelines, infrastructure, and deployment automation. "
            "Return structured infrastructure plans and deployment recommendations. "
            "Do not perform unrelated responsibilities."
        ),
    }

    # Exact match first
    if role_lower in role_map:
        return role_map[role_lower]

    # Partial match fallback
    for key, prompt in role_map.items():
        if any(word in role_lower for word in key.split()):
            return prompt

    # Generic fallback with the user-supplied role name
    return (
        f"You are the {role} in MissionOps AI. "
        f"Your responsibility is to fulfil the duties of a {role}. "
        "Return structured, professional findings. "
        "Do not perform responsibilities outside your role."
    )

# ──────────────────────────────────────────────────────────────────────────────
# ENDPOINTS
# ──────────────────────────────────────────────────────────────────────────────

@router.post(
    "/test",
    response_model=AITestResponse,
    summary="General Gemini connectivity test",
    description="Send an arbitrary prompt to Gemini and receive the real model response."
)
async def ai_test(payload: AITestRequest) -> AITestResponse:
    """
    POST /api/ai/test

    Verifies that the MissionOps backend can securely communicate with Gemini.
    Makes a REAL request — no mock data is returned.
    """
    try:
        result = GroqService.chat(
            system_prompt=_DEFAULT_SYSTEM_PROMPT,
            user_prompt=payload.prompt,
        )
        return AITestResponse(
            success=True,
            response=result,
            model=GroqService._get_model(),
        )

    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc))
    except PermissionError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc))
    except ConnectionError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc))
    except RuntimeError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))


@router.post(
    "/task",
    response_model=AITaskResponse,
    summary="Role-specific AI task execution",
    description="Assign a task to a named AI role (e.g., Research Analyst) and receive a structured response."
)
async def ai_task(payload: AITaskRequest) -> AITaskResponse:
    """
    POST /api/ai/task

    Sends a task to Gemini using a role-specific system prompt.
    This proves that different MissionOps AI roles can be driven through
    the same secure backend gateway.
    """
    try:
        system_prompt = _build_role_system_prompt(payload.role)
        result = GroqService.chat(
            system_prompt=system_prompt,
            user_prompt=payload.task,
        )
        return AITaskResponse(
            success=True,
            role=payload.role,
            task=payload.task,
            result=result,
            model=GroqService._get_model(),
        )

    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc))
    except PermissionError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc))
    except ConnectionError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc))
    except RuntimeError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))
