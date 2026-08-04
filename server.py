"""
==========================================================================
MISSIONOPS DASHBOARD - REST API BACKEND SERVER (SOFTWARE OS THEME)
==========================================================================
Serves static frontend files and provides REST API endpoints under /api/v1/
"""

import http.server
import socketserver
import json
import re
import os
import time

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# --------------------------------------------------------------------------
# IN-MEMORY BACKEND DATABASE (SOFTWARE TEAM WORKFORCE SCHEMAS)
# --------------------------------------------------------------------------

DB = {
    "mission": {
        "id": "prj_9021_alpha",
        "codeName": "PROJECT ALPHA (SAAS OS)",
        "name": "Project Alpha (SaaS OS)",
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
            { "id": "obj_01", "code": "FE-101", "name": "Frontend Design System & Accessibility", "progress": 92, "status": "IN PROGRESS", "leadAgent": "Aura (Frontend Lead)" },
            { "id": "obj_02", "code": "BE-202", "name": "REST API Microservices & DB Pooling", "progress": 65, "status": "IN PROGRESS", "leadAgent": "Titan (Backend Lead)" },
            { "id": "obj_03", "code": "SEC-303", "name": "OAuth2 Authentication & Key Rotation", "progress": 100, "status": "COMPLETED", "leadAgent": "Cipher (Security Lead)" },
            { "id": "obj_04", "code": "OPS-404", "name": "Automated Kubernetes CI/CD Pipeline", "progress": 40, "status": "IN PROGRESS", "leadAgent": "Vortex (DevOps Lead)" }
        ]
    },
    "employees": [
        {
            "id": "emp_001",
            "employeeNumber": "EMP-9401",
            "firstName": "Eleanor",
            "lastName": "Vance",
            "rankTitle": "Director",
            "role": "Engineering Operations Director",
            "department": "Engineering Management",
            "email": "e.vance@missionops.dev",
            "avatarUrl": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
            "dutyStatus": "ON_DUTY"
        },
        {
            "id": "emp_002",
            "employeeNumber": "EMP-9402",
            "firstName": "Marcus",
            "lastName": "Kovacs",
            "rankTitle": "Principal",
            "role": "Principal Frontend Architect",
            "department": "UI Platform",
            "email": "m.kovacs@missionops.dev",
            "avatarUrl": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
            "dutyStatus": "ON_DUTY"
        }
    ],
    "agents": [
        {
            "id": "agent-aura",
            "code": "AURA-01",
            "name": "Aura",
            "role": "Lead Frontend Engineer",
            "status": "Coding",
            "avatarBg": "rgba(0, 229, 255, 0.15)",
            "avatarColor": "#00e5ff",
            "progress": 85,
            "tasksCompleted": 428,
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
            "avatarBg": "rgba(245, 158, 11, 0.15)",
            "avatarColor": "#f59e0b",
            "progress": 60,
            "tasksCompleted": 215,
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
            "avatarBg": "rgba(244, 63, 94, 0.15)",
            "avatarColor": "#f43f5e",
            "progress": 78,
            "tasksCompleted": 740,
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
                { "title": "Add Composite Index on Status & CreatedAt", "done": True },
                { "title": "Verify Benchmark Latency Drops below 10ms", "done": False }
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
                { "title": "Generate 4096-bit RS256 Key Pair", "done": True },
                { "title": "Propagate Keys to Auth Service Nodes", "done": True },
                { "title": "Engineering Director Signoff", "done": False }
            ],
            "dueDate": "2026-08-06"
        },
        {
            "id": "TSK-105",
            "title": "Configure GitHub Actions Canary Deployment Pipeline",
            "status": "in_progress",
            "priority": "medium",
            "assignedAgentId": "agent-vortex",
            "assignedAgentName": "Vortex",
            "subtasks": [
                { "title": "Write Helm Chart Templates", "done": True },
                { "title": "Hook Canary Health Checks", "done": False }
            ],
            "dueDate": "2026-08-05"
        },
        {
            "id": "TSK-106",
            "title": "Audit Third-Party npm Dependency Vulnerabilities",
            "status": "backlog",
            "priority": "low",
            "assignedAgentId": "agent-cipher",
            "assignedAgentName": "Cipher",
            "subtasks": [
                { "title": "Run Dependabot Security Matrix", "done": False }
            ],
            "dueDate": "2026-08-08"
        },
        {
            "id": "TSK-107",
            "title": "Setup Cypress E2E Regression Test Suite for Billing",
            "status": "backlog",
            "priority": "high",
            "assignedAgentId": "agent-spectre",
            "assignedAgentName": "Spectre",
            "subtasks": [
                { "title": "Mock Stripe Checkout Webhook", "done": False },
                { "title": "Validate Invoice Generation Flow", "done": False }
            ],
            "dueDate": "2026-08-09"
        },
        {
            "id": "TSK-108",
            "title": "Fine-Tune Code Completion Embedding Models",
            "status": "ai_executing",
            "priority": "high",
            "assignedAgentId": "agent-nexus",
            "assignedAgentName": "Nexus",
            "subtasks": [
                { "title": "Ingest Repository AST Tokens", "done": True },
                { "title": "Evaluate Cross-Attention Loss", "done": False }
            ],
            "dueDate": "2026-08-04"
        }
    ],
    "timelinePhases": [
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
    ],
    "activityLogs": [
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
        },
        {
            "id": "evt-4",
            "timestamp": "13:20:00",
            "agentName": "Vortex",
            "agentId": "agent-vortex",
            "severity": "WARN",
            "message": "Canary deployment build #104 latency spike detected (120ms). Auto-rolled back.",
            "category": "DEVOPS"
        },
        {
            "id": "evt-5",
            "timestamp": "13:15:33",
            "agentName": "Spectre",
            "agentId": "agent-spectre",
            "severity": "SUCCESS",
            "message": "Cypress E2E test suite passed (42/42 tests clean).",
            "category": "QA"
        }
    ],
    "analytics": {
        "workloadDistribution": [
            { "agent": "Nexus", "percentage": 28, "color": "#f43f5e" },
            { "agent": "Titan", "percentage": 24, "color": "#6366f1" },
            { "agent": "Cipher", "percentage": 20, "color": "#10b981" },
            { "agent": "Aura", "percentage": 16, "color": "#00e5ff" },
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
}


class MissionOpsRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def send_json(self, data, code=200):
        time.sleep(0.1)
        response_bytes = json.dumps({
            "status": "success",
            "code": code,
            "meta": {
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "version": "v2.4.1-api"
            },
            "data": data
        }).encode('utf-8')
        
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(response_bytes)))
        self.end_headers()
        self.wfile.write(response_bytes)

    def do_GET(self):
        path = self.path.split('?')[0]

        if path == '/api/v1/mission':
            self.send_json(DB["mission"])
        elif path == '/api/v1/employees':
            self.send_json(DB["employees"])
        elif path == '/api/v1/agents':
            self.send_json(DB["agents"])
        elif path == '/api/v1/tasks':
            self.send_json(DB["tasks"])
        elif path == '/api/v1/timeline':
            self.send_json(DB["timelinePhases"])
        elif path == '/api/v1/activity':
            self.send_json(DB["activityLogs"])
        elif path == '/api/v1/analytics':
            self.send_json(DB["analytics"])
        else:
            super().do_GET()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body_bytes = self.rfile.read(content_length)
        body = json.loads(body_bytes.decode('utf-8')) if body_bytes else {}

        if self.path == '/api/v1/tasks':
            new_id = f"TSK-{len(DB['tasks']) + 101}"
            new_task = {
                "id": new_id,
                "title": body.get("title", "New Task"),
                "status": body.get("status", "backlog"),
                "priority": body.get("priority", "medium"),
                "assignedAgentId": body.get("assignedAgentId", "agent-aura"),
                "assignedAgentName": body.get("assignedAgentName", "Aura"),
                "subtasks": body.get("subtasks", []),
                "dueDate": body.get("dueDate", time.strftime("%Y-%m-%d", time.gmtime()))
            }
            DB["tasks"].insert(0, new_task)
            self.send_json(new_task, code=201)

        elif self.path == '/api/v1/mission/defcon':
            DB["mission"]["status"] = "Sprint 14 Active"
            self.send_json(DB["mission"])
        else:
            self.send_error(404, "Endpoint not found")

    def do_PATCH(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body_bytes = self.rfile.read(content_length)
        body = json.loads(body_bytes.decode('utf-8')) if body_bytes else {}

        match_task = re.match(r'^/api/v1/tasks/([^/]+)$', self.path)
        if match_task:
            task_id = match_task.group(1)
            task = next((t for t in DB["tasks"] if t["id"] == task_id), None)
            if task:
                if "status" in body:
                    task["status"] = body["status"]
                self.send_json(task)
                return
            else:
                self.send_error(404, "Task not found")
                return

        match_agent = re.match(r'^/api/v1/agents/([^/]+)$', self.path)
        if match_agent:
            agent_id = match_agent.group(1)
            agent = next((a for a in DB["agents"] if a["id"] == agent_id), None)
            if agent:
                agent["status"] = "Coding" if agent["status"] == "Idle" else "Idle"
                self.send_json(agent)
                return
            else:
                self.send_error(404, "Agent not found")
                return

        self.send_error(404, "Endpoint not found")

def run():
    print(f"[*] Starting MissionOps SaaS Backend Server on http://localhost:{PORT}")
    with socketserver.TCPServer(("", PORT), MissionOpsRequestHandler) as httpd:
        httpd.serve_forever()

if __name__ == '__main__':
    run()
