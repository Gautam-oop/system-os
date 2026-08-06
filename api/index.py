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
        "objectives": []
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
            "status": "Idle",
            "avatarBg": "rgba(0, 229, 255, 0.15)",
            "avatarColor": "#00e5ff",
            "progress": 0,
            "tasksCompleted": 0,
            "currentTask": "Awaiting assignment...",
            "capabilities": ["React/Vite Architecture", "Design System UI", "a11y Compliance"],
            "lastActive": "Just now"
        },
        {
            "id": "agent-titan",
            "code": "TITAN-02",
            "name": "Titan",
            "role": "Backend & Infrastructure Lead",
            "status": "Idle",
            "avatarBg": "rgba(99, 102, 241, 0.15)",
            "avatarColor": "#6366f1",
            "progress": 0,
            "tasksCompleted": 0,
            "currentTask": "Awaiting assignment...",
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
            "progress": 0,
            "tasksCompleted": 0,
            "currentTask": "Awaiting assignment...",
            "capabilities": ["JWT Authentication", "Zero-Trust Protocol", "Penetration Audit"],
            "lastActive": "Just now"
        },
        {
            "id": "agent-vortex",
            "code": "VORTEX-04",
            "name": "Vortex",
            "role": "DevOps & CI/CD Engineer",
            "status": "Idle",
            "avatarBg": "rgba(245, 158, 11, 0.15)",
            "avatarColor": "#f59e0b",
            "progress": 0,
            "tasksCompleted": 0,
            "currentTask": "Awaiting assignment...",
            "capabilities": ["Docker & K8s", "GitHub Actions", "Terraform Infra"],
            "lastActive": "5s ago"
        },
        {
            "id": "agent-spectre",
            "code": "SPECTRE-05",
            "name": "Spectre",
            "role": "QA & Test Automation Engineer",
            "status": "Idle",
            "avatarBg": "rgba(59, 130, 246, 0.15)",
            "avatarColor": "#3b82f6",
            "progress": 0,
            "tasksCompleted": 0,
            "currentTask": "Awaiting assignment...",
            "capabilities": ["Playwright & Cypress", "Regression Testing", "Load Testing"],
            "lastActive": "1m ago"
        },
        {
            "id": "agent-nexus",
            "code": "NEXUS-06",
            "name": "Nexus",
            "role": "Data & ML Specialist",
            "status": "Idle",
            "avatarBg": "rgba(244, 63, 94, 0.15)",
            "avatarColor": "#f43f5e",
            "progress": 0,
            "tasksCompleted": 0,
            "currentTask": "Awaiting assignment...",
            "capabilities": ["Vector Indexing", "LLM Fine-Tuning", "Telemetry Models"],
            "lastActive": "Just now"
        }
    ],
    "tasks": [],
    "timelinePhases": [],
    "activityLogs": [],
    "analytics": {
        "workloadDistribution": [],
        "successRateHistory": [],
        "resourceUtilizationHistory": [],
        "threatLatencyHistory": []
    }
}


from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):

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
        norm = path.replace('/api/v1', '/api')

        if norm == '/api/mission' or norm.startswith('/api/mission/'):
            self.send_json(DB["mission"])
        elif norm == '/api/employees':
            self.send_json(DB["employees"])
        elif norm == '/api/agents' or norm == '/api/workforce':
            self.send_json(DB["agents"])
        elif norm == '/api/tasks':
            self.send_json(DB["tasks"])
        elif norm == '/api/timeline':
            self.send_json(DB["timelinePhases"])
        elif norm == '/api/activity':
            self.send_json(DB["activityLogs"])
        elif norm == '/api/analytics':
            self.send_json(DB["analytics"])
        else:
            self.send_error(404, "Endpoint not found")

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body_bytes = self.rfile.read(content_length)
        body = json.loads(body_bytes.decode('utf-8')) if body_bytes else {}

        path = self.path.split('?')[0]
        norm = path.replace('/api/v1', '/api')

        if norm == '/api/tasks':
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

        elif norm == '/api/mission/defcon':
            DB["mission"]["status"] = "Sprint 14 Active"
            self.send_json(DB["mission"])
        else:
            self.send_error(404, "Endpoint not found")

    def do_PATCH(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body_bytes = self.rfile.read(content_length)
        body = json.loads(body_bytes.decode('utf-8')) if body_bytes else {}

        path = self.path.split('?')[0]
        norm = path.replace('/api/v1', '/api')

        match_task = re.match(r'^/api/tasks/([^/]+)$', norm)
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

        match_agent = re.match(r'^/api/(?:agents|workforce)/([^/]+)(?:/status)?$', norm)
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

