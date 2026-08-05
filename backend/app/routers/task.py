"""
==========================================================================
MISSIONOS FASTAPI BACKEND - TASK ROUTER
==========================================================================
"""

from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from backend.app.models.task import CreateTaskRequest, UpdateTaskStatusRequest, TaskResponse
from backend.app.models.response import ApiResponse
from backend.app.database.mock_db import db_repo
from backend.app.middleware.auth import get_current_user

router = APIRouter(prefix="/api", tags=["Tasks & Kanban"], dependencies=[Depends(get_current_user)])

@router.get("/tasks", response_model=ApiResponse[List[TaskResponse]])
def get_all_tasks():
    """
    Retrieve list of all engineering tasks in Kanban board.
    """
    tasks_list = db_repo.get_tasks()
    return ApiResponse(
        status="success",
        code=200,
        data=[TaskResponse(**t) for t in tasks_list]
    )

@router.post("/tasks", response_model=ApiResponse[TaskResponse], status_code=status.HTTP_201_CREATED)
def create_task(payload: CreateTaskRequest):
    """
    Create a new Kanban engineering task ticket.
    """
    subtask_dicts = [{"title": s.title, "done": s.done} for s in (payload.subtasks or [])]
    created_task = db_repo.create_task(
        title=payload.title,
        priority=payload.priority,
        assigned_agent_id=payload.assignedAgentId,
        assigned_agent_name=payload.assignedAgentName,
        status=payload.status,
        subtasks=subtask_dicts
    )
    return ApiResponse(
        status="success",
        code=201,
        message="Task ticket created successfully",
        data=TaskResponse(**created_task)
    )

@router.patch("/tasks/{task_id}", response_model=ApiResponse[TaskResponse])
def update_task_status(task_id: str, payload: UpdateTaskStatusRequest):
    """
    Update status stage of a specific task ticket (e.g. backlog -> in_progress -> completed).
    """
    updated_task = db_repo.update_task_status(task_id, payload.status)
    if not updated_task:
        raise HTTPException(status_code=404, detail=f"Task '{task_id}' not found")
    return ApiResponse(
        status="success",
        code=200,
        data=TaskResponse(**updated_task)
    )
