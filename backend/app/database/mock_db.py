"""
==========================================================================
MISSIONOS FASTAPI BACKEND - IN-MEMORY MOCK DATABASE REPOSITORY
==========================================================================
Clean architecture repository providing thread-safe mock JSON data operations.
"""

from typing import Dict, Any, List, Optional
import time

class MockDatabaseRepository:
    def __init__(self):
        self._db: Dict[str, Any] = {
            "missions": {
                "prj_9021_alpha": {
                    "id": "prj_9021_alpha",
                    "codeName": "SAAS OS",
                    "name": "SaaS OS",
                    "status": "Sprint 14 in Progress",
                    "commanderId": "emp_001",
                    "startedAt": "2026-08-01T06:00:00.000Z",
                    "targetETA": "Aug 15, 2026",
                    "overallProgress": 68,
                    "activeMembersCount": 6,
                    "completedTasksCount": 428,
                    "pendingTasksCount": 14,
                    "currentSprint": "Sprint 14",
                    "sprintDaysRemaining": 3,
                    "description": "Next-generation AI Workforce Operating System for accelerating software engineering teams.",
                    "objectives": [
                        { "id": "obj_01", "code": "FE-101", "name": "Frontend Design System & Accessibility", "progress": 92, "status": "IN PROGRESS", "leadAgentId": "Aura (Frontend Lead)" },
                        { "id": "obj_02", "code": "BE-202", "name": "REST API Microservices & DB Pooling", "progress": 65, "status": "IN PROGRESS", "leadAgentId": "Titan (Backend Lead)" },
                        { "id": "obj_03", "code": "SEC-303", "name": "OAuth2 Authentication & Key Rotation", "progress": 100, "status": "COMPLETED", "leadAgentId": "Cipher (Security Lead)" },
                        { "id": "obj_04", "code": "OPS-404", "name": "Automated Kubernetes CI/CD Pipeline", "progress": 40, "status": "IN PROGRESS", "leadAgentId": "Vortex (DevOps Lead)" }
                    ]
                }
            },
            "workforce": [
                {
                    "id": "agent-aura",
                    "code": "AURA-01",
                    "name": "Aura",
                    "role": "Lead Frontend Engineer",
                    "status": "Coding",
                    "avatarBg": "rgba(6, 182, 212, 0.12)",
                    "avatarColor": "#0891b2",
                    "progress": 85,
                    "tasksCompleted": 428,
                    "activeOperation": "Refactoring UI Components & Accessibility Standards",
                    "currentTask": "Refactoring UI Components & Accessibility Standards",
                    "capabilities": ["React/Vite Architecture", "Design System UI", "a11y Compliance"],
                    "lastActive": "Just now"
                },
                {
                    "id": "agent-titan",
                    "code": "TITAN-02",
                    "name": "Titan",
                    "role": "Backend & Infrastructure Lead",
                    "status": "Reviewing",
                    "avatarBg": "rgba(99, 102, 241, 0.15)",
                    "avatarColor": "#6366f1",
                    "progress": 92,
                    "tasksCompleted": 312,
                    "activeOperation": "Optimizing PostgreSQL Connection Pool & REST API",
                    "currentTask": "Optimizing PostgreSQL Connection Pool & REST API",
                    "capabilities": ["Go/Python Microservices", "PostgreSQL Indexing", "GraphQL"],
                    "lastActive": "2s ago"
                },
                {
                    "id": "agent-cipher",
                    "code": "CIPHER-03",
                    "name": "Cipher",
                    "role": "Security & Auth Specialist",
                    "status": "Idle",
                    "avatarBg": "rgba(16, 185, 129, 0.15)",
                    "avatarColor": "#10b981",
                    "progress": 100,
                    "tasksCompleted": 590,
                    "activeOperation": "Verifying OAuth2 Token Rotation Protocol",
                    "currentTask": "Verifying OAuth2 Token Rotation Protocol",
                    "capabilities": ["JWT Authentication", "Zero-Trust Protocol", "Penetration Audit"],
                    "lastActive": "Just now"
                },
                {
                    "id": "agent-vortex",
                    "code": "VORTEX-04",
                    "name": "Vortex",
                    "role": "DevOps & CI/CD Engineer",
                    "status": "Deploying",
                    "avatarBg": "rgba(249, 115, 22, 0.15)",
                    "avatarColor": "#ea580c",
                    "progress": 60,
                    "tasksCompleted": 215,
                    "activeOperation": "Automating Kubernetes Canary Deployment Pipeline",
                    "currentTask": "Automating Kubernetes Canary Deployment Pipeline",
                    "capabilities": ["Docker & K8s", "GitHub Actions", "Terraform Infra"],
                    "lastActive": "5s ago"
                },
                {
                    "id": "agent-spectre",
                    "code": "SPECTRE-05",
                    "name": "Spectre",
                    "role": "QA & Test Automation Engineer",
                    "status": "Testing",
                    "avatarBg": "rgba(59, 130, 246, 0.15)",
                    "avatarColor": "#3b82f6",
                    "progress": 45,
                    "tasksCompleted": 180,
                    "activeOperation": "Executing End-to-End Cypress Integration Suite",
                    "currentTask": "Executing End-to-End Cypress Integration Suite",
                    "capabilities": ["Playwright & Cypress", "Regression Testing", "Load Testing"],
                    "lastActive": "1m ago"
                },
                {
                    "id": "agent-nexus",
                    "code": "NEXUS-06",
                    "name": "Nexus",
                    "role": "Data & ML Specialist",
                    "status": "Training",
                    "avatarBg": "rgba(239, 68, 68, 0.15)",
                    "avatarColor": "#dc2626",
                    "progress": 78,
                    "tasksCompleted": 740,
                    "activeOperation": "Fine-Tuning Code Completion Embedding Model",
                    "currentTask": "Fine-Tuning Code Completion Embedding Model",
                    "capabilities": ["Vector Indexing", "LLM Fine-Tuning", "Telemetry Models"],
                    "lastActive": "Just now"
                }
            ],
            "tasks": [
                {
                    "id": "TSK-101",
                    "title": "Refactor Core Dashboard Layout Grid System",
                    "status": "completed",
                    "priority": "high",
                    "assignedAgentId": "agent-aura",
                    "assignedAgentName": "Aura",
                    "subtasks": [
                        { "title": "Setup Flexible CSS Grid", "done": True },
                        { "title": "Verify Mobile Responsive Breakpoints", "done": True }
                    ],
                    "dueDate": "2026-08-04"
                },
                {
                    "id": "TSK-102",
                    "title": "Implement Accessibility Standard ARIA Attributes",
                    "status": "ai_executing",
                    "priority": "critical",
                    "assignedAgentId": "agent-aura",
                    "assignedAgentName": "Aura",
                    "subtasks": [
                        { "title": "Audit Keyboard Navigation Focus", "done": True },
                        { "title": "Add Dynamic Live Region Announcers", "done": False }
                    ],
                    "dueDate": "2026-08-05"
                },
                {
                    "id": "TSK-103",
                    "title": "Optimize PostgreSQL Query Indexing for Tasks Endpoint",
                    "status": "ai_executing",
                    "priority": "critical",
                    "assignedAgentId": "agent-titan",
                    "assignedAgentName": "Titan",
                    "subtasks": [
                        { "title": "Analyze Slow Query Logs", "done": True },
                        { "title": "Add Composite Index on Status & CreatedAt", "done": True }
                    ],
                    "dueDate": "2026-08-04"
                },
                {
                    "id": "TSK-104",
                    "title": "Rotate OAuth API Secrets & JWT Refresh Keys",
                    "status": "verification",
                    "priority": "medium",
                    "assignedAgentId": "agent-cipher",
                    "assignedAgentName": "Cipher",
                    "subtasks": [
                        { "title": "Generate 4096-bit RS256 Key Pair", "done": True }
                    ],
                    "dueDate": "2026-08-06"
                }
            ]
        }

    def get_mission(self, mission_id: str = "prj_9021_alpha") -> Optional[Dict[str, Any]]:
        return self._db["missions"].get(mission_id) or self._db["missions"].get("prj_9021_alpha")

    def create_mission(self, name: str, description: str, target_eta: str = "Aug 15, 2026", director: str = "Eleanor Vance") -> Dict[str, Any]:
        new_id = f"prj_{int(time.time())}"
        code_name = name.upper()
        new_mission = {
            "id": new_id,
            "codeName": code_name,
            "name": name,
            "status": "Sprint 14 Active",
            "commanderId": "emp_001",
            "startedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "targetETA": target_eta,
            "overallProgress": 0,
            "activeMembersCount": len(self._db["workforce"]),
            "completedTasksCount": 0,
            "pendingTasksCount": 0,
            "currentSprint": "Sprint 14",
            "sprintDaysRemaining": 14,
            "description": description,
            "objectives": [
                { "id": f"obj_{int(time.time())}", "code": "FE-101", "name": "Frontend Architecture & UI", "progress": 0, "status": "IN PROGRESS", "leadAgentId": "agent-aura" }
            ]
        }
        self._db["missions"][new_id] = new_mission
        return new_mission

    def get_tasks(self) -> List[Dict[str, Any]]:
        return self._db["tasks"]

    def create_task(self, title: str, priority: str = "medium", assigned_agent_id: str = "agent-aura", assigned_agent_name: str = "Aura", status: str = "backlog", subtasks: list = None) -> Dict[str, Any]:
        new_id = f"TSK-{len(self._db['tasks']) + 101}"
        new_task = {
            "id": new_id,
            "title": title,
            "status": status,
            "priority": priority,
            "assignedAgentId": assigned_agent_id,
            "assignedAgentName": assigned_agent_name,
            "subtasks": subtasks or [],
            "dueDate": time.strftime("%Y-%m-%d", time.gmtime())
        }
        self._db["tasks"].insert(0, new_task)
        return new_task

    def update_task_status(self, task_id: str, new_status: str) -> Optional[Dict[str, Any]]:
        task = next((t for t in self._db["tasks"] if t["id"] == task_id), None)
        if task:
            task["status"] = new_status
            return task
        return None

    def get_workforce(self) -> List[Dict[str, Any]]:
        return self._db["workforce"]

    def get_teammate(self, teammate_id: str) -> Optional[Dict[str, Any]]:
        return next((a for a in self._db["workforce"] if a["id"] == teammate_id), None)

    def toggle_teammate_status(self, teammate_id: str, new_status: Optional[str] = None) -> Optional[Dict[str, Any]]:
        teammate = self.get_teammate(teammate_id)
        if teammate:
            if new_status:
                teammate["status"] = new_status
            else:
                teammate["status"] = "Coding" if teammate["status"] == "Idle" else "Idle"
            return teammate
        return None

db_repo = MockDatabaseRepository()
