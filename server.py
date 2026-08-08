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
import uuid

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# --------------------------------------------------------------------------
# MOCK AUTH STORE (in-memory users + sessions)
# --------------------------------------------------------------------------

AUTH_USERS = {
    "admin@missionops.dev": {
        "id": "usr_admin_001",
        "name": "Eleanor Vance",
        "email": "admin@missionops.dev",
        "password": "password123",
        "role": "admin",
        "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
        "created_at": "2026-08-01T06:00:00Z",
        "last_login": None
    }
}
AUTH_TOKENS = {}  # token -> email mapping


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
        norm = path.replace('/api/v1', '/api')

        if norm == '/api/auth/me':
            token = self.headers.get('Authorization', '').replace('Bearer ', '').strip()
            email = AUTH_TOKENS.get(token)
            if not email:
                body = json.dumps({"detail": "Unauthorized"}).encode('utf-8')
                self.send_response(401)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return
            
            from backend.app.database.user_db import SessionLocal, User
            db = SessionLocal()
            try:
                user = db.query(User).filter(User.email == email).first()
                if not user:
                    user = User(id="temp_usr", email=email, name="MissionOps User", role="admin", is_active=True)
                
                if not user.is_active:
                    err = json.dumps({"detail": "Your account has been disabled."}).encode('utf-8')
                    self.send_response(403)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Content-Length', str(len(err)))
                    self.end_headers()
                    self.wfile.write(err)
                    return
                
                self.send_json({
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "role": user.role,
                    "avatar": user.avatar,
                    "created_at": user.created_at.strftime("%Y-%m-%dT%H:%M:%SZ") if hasattr(user.created_at, "strftime") else str(user.created_at),
                    "last_login": user.last_login.strftime("%Y-%m-%dT%H:%M:%SZ") if user.last_login and hasattr(user.last_login, "strftime") else (str(user.last_login) if user.last_login else None),
                    "is_active": user.is_active
                })
            except Exception as e:
                err = json.dumps({"detail": str(e)}).encode('utf-8')
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(err)))
                self.end_headers()
                self.wfile.write(err)
            finally:
                db.close()
        elif norm == '/api/mission' or norm.startswith('/api/mission/'):
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
        elif norm == '/api/admin/users/stats':
            token = self.headers.get('Authorization', '').replace('Bearer ', '').strip()
            email = AUTH_TOKENS.get(token)
            
            from backend.app.database.user_db import SessionLocal, User
            db = SessionLocal()
            try:
                current_user = db.query(User).filter(User.email == email).first()
                if not current_user or current_user.role != 'admin':
                    err = json.dumps({"detail": "Forbidden: Admin access required."}).encode('utf-8')
                    self.send_response(403)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Content-Length', str(len(err)))
                    self.end_headers()
                    self.wfile.write(err)
                    return
                
                total = db.query(User).count()
                active = db.query(User).filter(User.is_active == True).count()
                inactive = db.query(User).filter(User.is_active == False).count()
                admins = db.query(User).filter(User.role == "admin").count()
                
                self.send_json({
                    "total_users": total,
                    "active_users": active,
                    "inactive_users": inactive,
                    "admin_count": admins
                })
            except Exception as e:
                err = json.dumps({"detail": str(e)}).encode('utf-8')
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(err)))
                self.end_headers()
                self.wfile.write(err)
            finally:
                db.close()
        elif norm == '/api/admin/users':
            token = self.headers.get('Authorization', '').replace('Bearer ', '').strip()
            email = AUTH_TOKENS.get(token)
            
            from backend.app.database.user_db import SessionLocal, User
            db = SessionLocal()
            try:
                current_user = db.query(User).filter(User.email == email).first()
                if not current_user or current_user.role != 'admin':
                    err = json.dumps({"detail": "Forbidden: Admin access required."}).encode('utf-8')
                    self.send_response(403)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Content-Length', str(len(err)))
                    self.end_headers()
                    self.wfile.write(err)
                    return
                
                from urllib.parse import urlparse, parse_qs
                parsed_url = urlparse(self.path)
                params = parse_qs(parsed_url.query)
                
                search = params.get('search', [None])[0]
                role = params.get('role', [None])[0]
                status_filter = params.get('status', [None])[0]
                
                query = db.query(User)
                if search:
                    search_term = f"%{search}%"
                    query = query.filter(User.name.like(search_term) | User.email.like(search_term))
                if role:
                    query = query.filter(User.role == role)
                if status_filter:
                    if status_filter.lower() == "active":
                        query = query.filter(User.is_active == True)
                    elif status_filter.lower() == "disabled":
                        query = query.filter(User.is_active == False)
                
                users = query.all()
                users_list = []
                for u in users:
                    users_list.append({
                        "id": u.id,
                        "name": u.name,
                        "email": u.email,
                        "created_at": u.created_at.strftime("%Y-%m-%dT%H:%M:%SZ") if hasattr(u.created_at, "strftime") else str(u.created_at),
                        "last_login": u.last_login.strftime("%Y-%m-%dT%H:%M:%SZ") if u.last_login and hasattr(u.last_login, "strftime") else (str(u.last_login) if u.last_login else None),
                        "role": u.role,
                        "avatar": u.avatar,
                        "is_active": u.is_active
                    })
                self.send_json(users_list)
            except Exception as e:
                err = json.dumps({"detail": str(e)}).encode('utf-8')
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(err)))
                self.end_headers()
                self.wfile.write(err)
            finally:
                db.close()
        else:
            super().do_GET()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body_bytes = self.rfile.read(content_length)
        body = json.loads(body_bytes.decode('utf-8')) if body_bytes else {}

        path = self.path.split('?')[0]
        norm = path.replace('/api/v1', '/api')

        if norm == '/api/auth/login':
            email = body.get('email', '').strip().lower()
            password = body.get('password', '')
            
            from backend.app.database.user_db import SessionLocal, User
            from backend.app.utils.password import verify_password, hash_password
            from datetime import datetime
            db = SessionLocal()
            try:
                user = db.query(User).filter(User.email == email).first()
                
                if user and not user.is_active:
                    err = json.dumps({"detail": "Your account has been disabled. Please contact the administrator."}).encode('utf-8')
                    self.send_response(403)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Content-Length', str(len(err)))
                    self.end_headers()
                    self.wfile.write(err)
                    return

                if not user:
                    # Auto-register prototype convenience
                    name_prefix = email.split('@')[0].capitalize()
                    user = User(
                        id=f"usr_{uuid.uuid4().hex[:12]}",
                        name=f"{name_prefix} (Prototype)",
                        email=email,
                        hashed_password=hash_password(password),
                        created_at=datetime.utcnow(),
                        last_login=None,
                        role="user",
                        avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
                        is_active=True
                    )
                    db.add(user)
                    db.commit()
                    db.refresh(user)
                else:
                    # Update password if changed (prototype convenience)
                    user.hashed_password = hash_password(password)
                
                user.last_login = datetime.utcnow()
                db.commit()
                db.refresh(user)
                
                token = 'mock_' + str(uuid.uuid4()).replace('-', '')
                refresh = 'refresh_' + str(uuid.uuid4()).replace('-', '')
                AUTH_TOKENS[token] = email
                AUTH_TOKENS[refresh] = email
                
                # Update in-memory dict so other legacy endpoints work if needed
                AUTH_USERS[email] = {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "role": user.role,
                    "avatar": user.avatar,
                    "created_at": user.created_at.strftime("%Y-%m-%dT%H:%M:%SZ"),
                    "last_login": user.last_login.strftime("%Y-%m-%dT%H:%M:%SZ") if user.last_login else None,
                    "is_active": user.is_active
                }
                
                self.send_json({
                    "access_token": token,
                    "refresh_token": refresh,
                    "token_type": "bearer",
                    "user": AUTH_USERS[email]
                })
            except Exception as e:
                err = json.dumps({"detail": str(e)}).encode('utf-8')
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(err)))
                self.end_headers()
                self.wfile.write(err)
            finally:
                db.close()

        elif norm == '/api/auth/signup':
            email = body.get('email', '').strip().lower()
            password = body.get('password', '')
            name = body.get('name', 'New User')
            
            from backend.app.database.user_db import SessionLocal, User
            from backend.app.utils.password import hash_password
            from datetime import datetime
            db = SessionLocal()
            try:
                existing_user = db.query(User).filter(User.email == email).first()
                if existing_user:
                    err = json.dumps({"detail": "An account with this email address already exists."}).encode('utf-8')
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Content-Length', str(len(err)))
                    self.end_headers()
                    self.wfile.write(err)
                    return
                
                new_user = User(
                    id=f"usr_{uuid.uuid4().hex[:12]}",
                    name=name,
                    email=email,
                    hashed_password=hash_password(password),
                    created_at=datetime.utcnow(),
                    last_login=datetime.utcnow(),
                    role="user",
                    avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
                    is_active=True
                )
                db.add(new_user)
                db.commit()
                db.refresh(new_user)
                
                token = 'mock_' + str(uuid.uuid4()).replace('-', '')
                refresh = 'refresh_' + str(uuid.uuid4()).replace('-', '')
                AUTH_TOKENS[token] = email
                AUTH_TOKENS[refresh] = email
                
                user_data = {
                    "id": new_user.id,
                    "name": new_user.name,
                    "email": new_user.email,
                    "role": new_user.role,
                    "avatar": new_user.avatar,
                    "created_at": new_user.created_at.strftime("%Y-%m-%dT%H:%M:%SZ"),
                    "last_login": new_user.last_login.strftime("%Y-%m-%dT%H:%M:%SZ") if new_user.last_login else None,
                    "is_active": new_user.is_active
                }
                
                # Sync in-memory AUTH_USERS
                AUTH_USERS[email] = user_data
                
                self.send_json({
                    "access_token": token,
                    "refresh_token": refresh,
                    "token_type": "bearer",
                    "user": user_data
                }, code=201)
            except Exception as e:
                err = json.dumps({"detail": str(e)}).encode('utf-8')
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(err)))
                self.end_headers()
                self.wfile.write(err)
            finally:
                db.close()

        elif norm == '/api/auth/logout':
            token = self.headers.get('Authorization', '').replace('Bearer ', '').strip()
            AUTH_TOKENS.pop(token, None)
            self.send_json({"message": "Logged out successfully"})

        elif norm == '/api/auth/refresh':
            refresh = body.get('refresh_token', '')
            email = AUTH_TOKENS.get(refresh)
            
            from backend.app.database.user_db import SessionLocal, User
            db = SessionLocal()
            try:
                user = db.query(User).filter(User.email == email).first()
                if not user:
                    err = json.dumps({"detail": "User account no longer exists."}).encode('utf-8')
                    self.send_response(401)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Content-Length', str(len(err)))
                    self.end_headers()
                    self.wfile.write(err)
                    return
                
                if not user.is_active:
                    err = json.dumps({"detail": "Your account has been disabled."}).encode('utf-8')
                    self.send_response(403)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Content-Length', str(len(err)))
                    self.end_headers()
                    self.wfile.write(err)
                    return
                
                new_token = 'mock_' + str(uuid.uuid4()).replace('-', '')
                new_refresh = 'refresh_' + str(uuid.uuid4()).replace('-', '')
                
                AUTH_TOKENS.pop(refresh, None)
                AUTH_TOKENS[new_token] = email
                AUTH_TOKENS[new_refresh] = email
                
                user_data = {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "role": user.role,
                    "avatar": user.avatar,
                    "created_at": user.created_at.strftime("%Y-%m-%dT%H:%M:%SZ"),
                    "last_login": user.last_login.strftime("%Y-%m-%dT%H:%M:%SZ") if user.last_login else None,
                    "is_active": user.is_active
                }
                
                self.send_json({
                    "access_token": new_token,
                    "refresh_token": new_refresh,
                    "token_type": "bearer",
                    "user": user_data
                })
            except Exception as e:
                err = json.dumps({"detail": str(e)}).encode('utf-8')
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(err)))
                self.end_headers()
                self.wfile.write(err)
            finally:
                db.close()

        elif norm == '/api/tasks':
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
        elif norm == '/api/ai/test':
            token = self.headers.get('Authorization', '').replace('Bearer ', '').strip()
            email = AUTH_TOKENS.get(token)
            if not email or email not in AUTH_USERS:
                err = json.dumps({"detail": "Unauthorized"}).encode('utf-8')
                self.send_response(401)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(err)))
                self.end_headers()
                self.wfile.write(err)
                return

            prompt = body.get('prompt', '').strip()
            if not prompt:
                err = json.dumps({"detail": "Prompt must not be empty"}).encode('utf-8')
                self.send_response(422)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(err)))
                self.end_headers()
                self.wfile.write(err)
                return

            try:
                from backend.app.services.groq_service import GroqService
                result = GroqService.chat(
                    system_prompt="You are MissionOps AI, an expert AI assistant integrated into the MissionOps workforce operating system. Provide clear, professional, and concise responses. Do not expose internal implementation details.",
                    user_prompt=prompt,
                )
                response_bytes = json.dumps({
                    "success": True,
                    "response": result,
                    "model": GroqService._get_model()
                }).encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(response_bytes)))
                self.end_headers()
                self.wfile.write(response_bytes)
            except Exception as exc:
                err = json.dumps({"detail": str(exc)}).encode('utf-8')
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(err)))
                self.end_headers()
                self.wfile.write(err)

        elif norm == '/api/ai/task':
            token = self.headers.get('Authorization', '').replace('Bearer ', '').strip()
            email = AUTH_TOKENS.get(token)
            if not email or email not in AUTH_USERS:
                err = json.dumps({"detail": "Unauthorized"}).encode('utf-8')
                self.send_response(401)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(err)))
                self.end_headers()
                self.wfile.write(err)
                return

            task = body.get('task', '').strip()
            role = body.get('role', '').strip()
            if not task or not role:
                err = json.dumps({"detail": "Task and role must not be empty"}).encode('utf-8')
                self.send_response(422)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(err)))
                self.end_headers()
                self.wfile.write(err)
                return

            try:
                from backend.app.services.groq_service import GroqService
                from backend.app.routers.ai import _build_role_system_prompt
                system_prompt = _build_role_system_prompt(role)
                result = GroqService.chat(
                    system_prompt=system_prompt,
                    user_prompt=task,
                )
                response_bytes = json.dumps({
                    "success": True,
                    "role": role,
                    "task": task,
                    "result": result,
                    "model": GroqService._get_model()
                }).encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(response_bytes)))
                self.end_headers()
                self.wfile.write(response_bytes)
            except Exception as exc:
                err = json.dumps({"detail": str(exc)}).encode('utf-8')
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(err)))
                self.end_headers()
                self.wfile.write(err)

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

        match_admin_status = re.match(r'^/api/admin/users/([^/]+)/status$', norm)
        if match_admin_status:
            token = self.headers.get('Authorization', '').replace('Bearer ', '').strip()
            email = AUTH_TOKENS.get(token)
            
            from backend.app.database.user_db import SessionLocal, User
            db = SessionLocal()
            try:
                current_user = db.query(User).filter(User.email == email).first()
                if not current_user or current_user.role != 'admin':
                    err = json.dumps({"detail": "Forbidden: Admin access required."}).encode('utf-8')
                    self.send_response(403)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Content-Length', str(len(err)))
                    self.end_headers()
                    self.wfile.write(err)
                    return
                
                user_id = match_admin_status.group(1)
                user = db.query(User).filter(User.id == user_id).first()
                if not user:
                    err = json.dumps({"detail": "User not found"}).encode('utf-8')
                    self.send_response(404)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Content-Length', str(len(err)))
                    self.end_headers()
                    self.wfile.write(err)
                    return
                
                is_active = body.get('is_active', True)
                user.is_active = is_active
                db.commit()
                db.refresh(user)
                
                self.send_json({
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "created_at": user.created_at.strftime("%Y-%m-%dT%H:%M:%SZ") if hasattr(user.created_at, "strftime") else str(user.created_at),
                    "last_login": user.last_login.strftime("%Y-%m-%dT%H:%M:%SZ") if user.last_login and hasattr(user.last_login, "strftime") else (str(user.last_login) if user.last_login else None),
                    "role": user.role,
                    "avatar": user.avatar,
                    "is_active": user.is_active
                })
            except Exception as e:
                err = json.dumps({"detail": str(e)}).encode('utf-8')
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(err)))
                self.end_headers()
                self.wfile.write(err)
            finally:
                db.close()
            return

        self.send_error(404, "Endpoint not found")

def run():
    from backend.app.database.user_db import init_db
    init_db()
    print(f"[*] Starting MissionOps SaaS Backend Server on http://localhost:{PORT}")
    with socketserver.TCPServer(("", PORT), MissionOpsRequestHandler) as httpd:
        httpd.serve_forever()

if __name__ == '__main__':
    run()
