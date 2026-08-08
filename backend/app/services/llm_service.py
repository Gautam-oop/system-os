"""
==========================================================================
MISSIONOS FASTAPI BACKEND - LLM SERVICE
==========================================================================
Helper service communicating with Google Gemini API via REST calls.
"""

import os
import json
import requests
from typing import Dict, Any, Optional
from backend.app.config import settings

class LLMService:
    @staticmethod
    def generate_task_details(task_title: str, priority: str, agent_name: str, agent_role: str) -> Optional[Dict[str, Any]]:
        gemini_key = settings.GEMINI_API_KEY
        openai_key = os.getenv("OPENAI_API_KEY", "")

        if not gemini_key and not openai_key:
            print("[LLMService] No API key configured. Falling back to simulated metadata.")
            return None

        prompt = f"""
You are an expert AI software agent named {agent_name} specializing in {agent_role}.
You have been assigned the following task on the project:
Task Title: {task_title}
Priority: {priority}

Generate a structured response in JSON format.
Your response must contain exactly:
1. "subtasks": A list of exactly 4 to 6 highly specific, actionable subtasks/milestones for this task. Each subtask must be a string describing the engineering step. Keep them short, technical, and professional.
2. "agentNotes": A brief internal thought/technical analysis from the perspective of {agent_name} about how they plan to tackle this task (1-2 sentences).
3. "initialLog": A professional engineering log message from {agent_name} starting their work (e.g. "{agent_name} initialized workspace and began mapping the requirements for...") (1 sentence).

Example JSON format:
{{
  "subtasks": [
    "Identify security vulnerability vectors in JWT key rotation script",
    "Generate 4096-bit RS256 key pairs for authorization handshake",
    "Implement automated key rotation cron scheduler with database fallback",
    "Write unittest suite to assert token validity post-rotation"
  ],
  "agentNotes": "I will establish a secure, RS256-compliant token rotation mechanism, ensuring zero-downtime access for connected active workforce nodes.",
  "initialLog": "{agent_name} has generated the 4096-bit RS256 signing keys and is preparing token rotation middlewares."
}}
"""

        if gemini_key:
            return LLMService._generate_via_gemini(prompt, gemini_key, LLMService._get_task_schema())
        else:
            return LLMService._generate_via_openai(prompt, openai_key)

    @staticmethod
    def generate_mission_plan(name: str, description: str) -> Optional[Dict[str, Any]]:
        gemini_key = settings.GEMINI_API_KEY
        openai_key = os.getenv("OPENAI_API_KEY", "")

        if not gemini_key and not openai_key:
            print("[LLMService] No API key configured. Using local project plan generator.")
            return None

        prompt = f"""
You are a senior technical project manager with 15+ years of experience.
Decompose the following software engineering mission/project description into an executable project plan.
Project Name: {name}
Description: {description}

When the user submits a mission, do NOT simply answer the question. Instead, decompose the mission into an executable project plan.
Ensure the response is structured, deterministic, and suitable for rendering inside the MissionOps dashboard. Do not generate conversational text.

Generate a structured response in JSON format.
The JSON must include exactly:
1. "mission": An object representing the project metadata:
   - "id": "prj_9021_alpha"
   - "codeName": A short, uppercase codename for the project
   - "name": The project name
   - "status": "Sprint 1 Active"
   - "startedAt": "2026-08-01T06:00:00.000Z"
   - "targetETA": "Aug 31, 2026"
   - "overallProgress": 0
   - "description": Description of the project
2. "summary": Executive Summary containing:
   - "goal": Main goal/objective of the project
   - "scope": High level scope of work
   - "successCriteria": How to define success
   - "difficulty": "Low", "Medium", "High", or "Critical"
3. "employees": Array of specialized AI workforce agents assigned to the project. Choose from the following characters:
   - Elena Vance (Project Manager, ID: agent-pm, Code: PM-01, role: "Project Manager", avatarBg: "rgba(139, 92, 246, 0.15)", avatarColor: "#8b5cf6", capabilities: ["Agile Planning", "Backlog Triage", "Timeline Scheduling"])
   - Nexus (Research Analyst, ID: agent-research, Code: RA-02, role: "Research Analyst", avatarBg: "rgba(239, 68, 68, 0.15)", avatarColor: "#ef4444", capabilities: ["Market Research", "Competitor Analysis", "User Personas"])
   - Aura (UI/UX Designer, ID: agent-design, Code: DES-03, role: "UI/UX Designer", avatarBg: "rgba(6, 182, 212, 0.15)", avatarColor: "#06b6d4", capabilities: ["Wireframes", "Design System UI", "UI Components"])
   - Titan (Backend Engineer, ID: agent-backend, Code: BE-04, role: "Backend Engineer", avatarBg: "rgba(99, 102, 241, 0.15)", avatarColor: "#6366f1", capabilities: ["Database Architecture", "REST APIs", "AI Integration"])
   - Kovacs (Frontend Engineer, ID: agent-frontend, Code: FE-05, role: "Frontend Engineer", avatarBg: "rgba(0, 229, 255, 0.15)", avatarColor: "#00e5ff", capabilities: ["React/Vite Architecture", "Dashboard UI", "State Management"])
   - Spectre (QA Engineer, ID: agent-qa, Code: QA-06, role: "QA Engineer", avatarBg: "rgba(16, 185, 129, 0.15)", avatarColor: "#10b981", capabilities: ["Unit Testing", "Integration Testing", "Bug Fixing"])
   - Vortex (DevOps Engineer, ID: agent-devops, Code: DEV-07, role: "DevOps Engineer", avatarBg: "rgba(245, 158, 11, 0.15)", avatarColor: "#f59e0b", capabilities: ["CI/CD Pipeline", "Kubernetes", "Infrastructure as Code"])
4. "phases": Array of phases decomposing the work (Research, Planning, Design, Development, Testing):
   - "id": Phase ID (e.g., "phase-1", "phase-2", "phase-3", "phase-4", "phase-5")
   - "name": Phase Name (e.g. "Phase 1: Research", "Phase 2: Planning", "Phase 3: Design", "Phase 4: Development", "Phase 5: Testing")
   - "leadAgent": Lead agent name for the phase (e.g. "Nexus", "Elena Vance", "Aura", "Titan", "Spectre")
   - "status": "upcoming" (with Phase 1 as "in_progress")
   - "progress": 0 (with Phase 1 as 10)
   - "startDay": "Aug 01"
   - "endDay": "Aug 04"
   - "description": Description of this phase's goals
5. "tasks": Array of 5 to 8 engineering tasks distributed across the phases:
   - "id": Task ID (e.g., "TSK-101", "TSK-102")
   - "title": Short title of the task (e.g. "Market research", "Define architecture", "Wireframes", "Authentication", "Unit testing")
   - "status": "backlog" or "ai_executing" (Phase 1 tasks should be "ai_executing", others "backlog")
   - "priority": "high", "medium", "low", or "critical"
   - "assignedAgentId": ID of the assigned agent (e.g., "agent-research", "agent-backend")
   - "assignedAgentName": Name of the assigned agent (e.g., "Nexus", "Titan")
   - "subtasks": List of subtask objects:
     - "title": Title of subtask
     - "done": false
   - "startDate": Start date (YYYY-MM-DD)
   - "dueDate": Due date (YYYY-MM-DD)
6. "dependencies": List of task dependencies showing how tasks relate (e.g. Dashboard depends on Authentication, AI Integration depends on Dashboard, Testing depends on AI Integration):
   - "task": Task title (e.g. "Dashboard")
   - "dependsOn": Task title it depends on (e.g. "Authentication")
7. "timeline": Estimated duration for every phase:
   - "totalDuration": Total duration in days (e.g. "14 days")
   - "phaseEstimates": Array of objects:
     - "phaseName": Phase Name
     - "duration": Duration (e.g. "3 days")
8. "risks": List of identified risks:
   - "category": "Technical", "Schedule", or "Security"
   - "description": Detailed risk description (e.g., potential API changes, testing bottlenecks, token leakage)
   - "mitigation": Mitigation strategy
9. "deliverables": Array of final deliverables (e.g. ["Market Analysis Report", "Figma wireframe layout", "Authentication module", "Cypress integration suite"])
10. "metrics": Success metrics object:
   - "kpi": Key Performance Indicator description
   - "targetValue": Target value to hit
"""

        if gemini_key:
            return LLMService._generate_via_gemini(prompt, gemini_key, LLMService._get_mission_schema())
        else:
            return LLMService._generate_via_openai(prompt, openai_key)

    @staticmethod
    def _generate_via_gemini(prompt: str, api_key: str, schema: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        model = settings.GEMINI_MODEL or "gemini-2.5-flash"
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "responseMimeType": "application/json",
                "responseSchema": schema
            }
        }

        try:
            response = requests.post(url, headers=headers, json=payload, timeout=12)
            if response.status_code != 200:
                print(f"[LLMService] Error from Gemini API: {response.status_code} - {response.text}")
                return None
            
            res_data = response.json()
            candidates = res_data.get("candidates", [])
            if not candidates:
                print(f"[LLMService] No candidates in response: {res_data}")
                return None
            
            content = candidates[0].get("content", {})
            parts = content.get("parts", [])
            if not parts:
                print("[LLMService] Empty parts in candidate content")
                return None
            
            text = parts[0].get("text", "")
            if not text:
                print("[LLMService] Empty text in parts")
                return None

            return json.loads(text.strip())
        except Exception as e:
            print(f"[LLMService] Exception during Gemini generation: {e}")
            return None

    @staticmethod
    def _generate_via_openai(prompt: str, api_key: str) -> Optional[Dict[str, Any]]:
        model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
        payload = {
            "model": model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are a senior technical project manager assistant that only outputs valid, structured JSON. Do not wrap responses in markdown formats."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "response_format": {"type": "json_object"}
        }

        try:
            response = requests.post(url, headers=headers, json=payload, timeout=12)
            if response.status_code != 200:
                print(f"[LLMService] Error from OpenAI API: {response.status_code} - {response.text}")
                return None
            
            res_data = response.json()
            choices = res_data.get("choices", [])
            if not choices:
                return None
            
            text = choices[0].get("message", {}).get("content", "")
            if not text:
                return None

            return json.loads(text.strip())
        except Exception as e:
            print(f"[LLMService] Exception during OpenAI generation: {e}")
            return None

    @staticmethod
    def _get_task_schema() -> Dict[str, Any]:
        return {
            "type": "OBJECT",
            "properties": {
                "subtasks": {
                    "type": "ARRAY",
                    "items": {"type": "STRING"}
                },
                "agentNotes": {"type": "STRING"},
                "initialLog": {"type": "STRING"}
            },
            "required": ["subtasks", "agentNotes", "initialLog"]
        }

    @staticmethod
    def _get_mission_schema() -> Dict[str, Any]:
        return {
            "type": "OBJECT",
            "properties": {
                "mission": {
                    "type": "OBJECT",
                    "properties": {
                        "id": {"type": "STRING"},
                        "codeName": {"type": "STRING"},
                        "name": {"type": "STRING"},
                        "status": {"type": "STRING"},
                        "startedAt": {"type": "STRING"},
                        "targetETA": {"type": "STRING"},
                        "overallProgress": {"type": "INTEGER"},
                        "description": {"type": "STRING"}
                    },
                    "required": ["id", "codeName", "name", "status", "startedAt", "targetETA", "overallProgress", "description"]
                },
                "summary": {
                    "type": "OBJECT",
                    "properties": {
                        "goal": {"type": "STRING"},
                        "scope": {"type": "STRING"},
                        "successCriteria": {"type": "STRING"},
                        "difficulty": {"type": "STRING"}
                    },
                    "required": ["goal", "scope", "successCriteria", "difficulty"]
                },
                "employees": {
                    "type": "ARRAY",
                    "items": {
                        "type": "OBJECT",
                        "properties": {
                            "id": {"type": "STRING"},
                            "code": {"type": "STRING"},
                            "name": {"type": "STRING"},
                            "role": {"type": "STRING"},
                            "status": {"type": "STRING"},
                            "avatarBg": {"type": "STRING"},
                            "avatarColor": {"type": "STRING"},
                            "capabilities": {
                                "type": "ARRAY",
                                "items": {"type": "STRING"}
                            }
                        },
                        "required": ["id", "code", "name", "role", "status", "avatarBg", "avatarColor", "capabilities"]
                    }
                },
                "phases": {
                    "type": "ARRAY",
                    "items": {
                        "type": "OBJECT",
                        "properties": {
                            "id": {"type": "STRING"},
                            "name": {"type": "STRING"},
                            "leadAgent": {"type": "STRING"},
                            "status": {"type": "STRING"},
                            "progress": {"type": "INTEGER"},
                            "startDay": {"type": "STRING"},
                            "endDay": {"type": "STRING"},
                            "description": {"type": "STRING"}
                        },
                        "required": ["id", "name", "leadAgent", "status", "progress", "startDay", "endDay", "description"]
                    }
                },
                "tasks": {
                    "type": "ARRAY",
                    "items": {
                        "type": "OBJECT",
                        "properties": {
                            "id": {"type": "STRING"},
                            "title": {"type": "STRING"},
                            "status": {"type": "STRING"},
                            "priority": {"type": "STRING"},
                            "assignedAgentId": {"type": "STRING"},
                            "assignedAgentName": {"type": "STRING"},
                            "subtasks": {
                                "type": "ARRAY",
                                "items": {
                                    "type": "OBJECT",
                                    "properties": {
                                        "title": {"type": "STRING"},
                                        "done": {"type": "BOOLEAN"}
                                    },
                                    "required": ["title", "done"]
                                }
                            },
                            "startDate": {"type": "STRING"},
                            "dueDate": {"type": "STRING"}
                        },
                        "required": ["id", "title", "status", "priority", "assignedAgentId", "assignedAgentName", "subtasks", "startDate", "dueDate"]
                    }
                },
                "dependencies": {
                    "type": "ARRAY",
                    "items": {
                        "type": "OBJECT",
                        "properties": {
                            "task": {"type": "STRING"},
                            "dependsOn": {"type": "STRING"}
                        },
                        "required": ["task", "dependsOn"]
                    }
                },
                "timeline": {
                    "type": "OBJECT",
                    "properties": {
                        "totalDuration": {"type": "STRING"},
                        "phaseEstimates": {
                            "type": "ARRAY",
                            "items": {
                                "type": "OBJECT",
                                "properties": {
                                    "phaseName": {"type": "STRING"},
                                    "duration": {"type": "STRING"}
                                },
                                "required": ["phaseName", "duration"]
                            }
                        }
                    },
                    "required": ["totalDuration", "phaseEstimates"]
                },
                "risks": {
                    "type": "ARRAY",
                    "items": {
                        "type": "OBJECT",
                        "properties": {
                            "category": {"type": "STRING"},
                            "description": {"type": "STRING"},
                            "mitigation": {"type": "STRING"}
                        },
                        "required": ["category", "description", "mitigation"]
                    }
                },
                "deliverables": {
                    "type": "ARRAY",
                    "items": {"type": "STRING"}
                },
                "metrics": {
                    "type": "OBJECT",
                    "properties": {
                        "kpi": {"type": "STRING"},
                        "targetValue": {"type": "STRING"}
                    },
                    "required": ["kpi", "targetValue"]
                }
            },
            "required": [
                "mission", "summary", "employees", "phases", "tasks", "dependencies", "timeline", "risks", "deliverables", "metrics"
            ]
        }

    # ──────────────────────────────────────────────────────────────────────
    # REAL APPLICATION CODE GENERATOR
    # ──────────────────────────────────────────────────────────────────────
    @staticmethod
    def generate_application_code(name: str, description: str) -> dict:
        """
        Calls Gemini/GPT to produce real, runnable application code.
        Returns a dict of { relative_path: file_content } for every file.
        Falls back to a rich static template generator if no API key is set.
        """
        gemini_key = settings.GEMINI_API_KEY
        openai_key = os.getenv("OPENAI_API_KEY", "")

        slug = name.lower().replace(" ", "-").replace("/", "-")

        if gemini_key or (openai_key and openai_key != "your_openai_key_here"):
            print(f"[LLMService] Generating real code for: {name}")
            prompt = LLMService._build_codegen_prompt(name, description)
            result = None
            if gemini_key:
                result = LLMService._generate_code_via_gemini(prompt, gemini_key)
            elif openai_key:
                result = LLMService._generate_code_via_openai(prompt, openai_key)
            if result:
                return result

        print(f"[LLMService] No API key — using static template generator for: {name}")
        return LLMService._generate_static_template(name, description, slug)

    @staticmethod
    def _build_codegen_prompt(name: str, description: str) -> str:
        return f"""You are a senior full-stack software engineer. Generate a complete, working web application for the following project.

Project Name: {name}
Description: {description}

Output ONLY a valid JSON object (no markdown, no code fences). The JSON must have exactly one key per file, where the key is the relative file path and the value is the complete file content as a string.

Required files:
- "frontend/index.html": Complete HTML page with inline CSS and JavaScript. Must be fully functional as a standalone file (no build step needed). Use modern CSS with a dark glassmorphism theme. Include navigation, a hero section, and core features relevant to the project description.
- "frontend/style.css": Full CSS stylesheet used by the app.
- "backend/main.py": Complete Python FastAPI application with all routes, CORS middleware, and working endpoints relevant to this project. Include sample data.
- "backend/models.py": SQLAlchemy ORM models for all database tables.
- "backend/database.py": SQLite database setup and session management.
- "backend/requirements.txt": All required pip packages (fastapi, uvicorn, sqlalchemy, pydantic).
- "database/schema.sql": Complete SQL DDL for all tables.
- "README.md": Instructions to run the frontend (just open index.html) and backend (pip install -r requirements.txt && uvicorn main:app --reload).

IMPORTANT:
- Make the frontend/index.html fully self-contained and immediately runnable in a browser.
- Make the backend/main.py immediately runnable with: cd backend && uvicorn main:app --reload
- All code must be real, working, and specific to "{name}". Do not use placeholders.
- The frontend must connect to the backend API at http://localhost:8000

Return ONLY the JSON object."""

    @staticmethod
    def _generate_code_via_gemini(prompt: str, api_key: str) -> Optional[dict]:
        model = settings.GEMINI_MODEL or "gemini-2.5-flash"
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseMimeType": "application/json"}
        }
        try:
            resp = requests.post(url, headers={"Content-Type": "application/json"}, json=payload, timeout=60)
            if resp.status_code != 200:
                print(f"[LLMService] Gemini codegen error: {resp.status_code}")
                return None
            text = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
            return json.loads(text.strip())
        except Exception as e:
            print(f"[LLMService] Gemini codegen exception: {e}")
            return None

    @staticmethod
    def _generate_code_via_openai(prompt: str, api_key: str) -> Optional[dict]:
        url = "https://api.openai.com/v1/chat/completions"
        headers = {"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"}
        payload = {
            "model": os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            "messages": [
                {"role": "system", "content": "You are a senior full-stack engineer. Output only valid JSON. No markdown."},
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"}
        }
        try:
            resp = requests.post(url, headers=headers, json=payload, timeout=60)
            if resp.status_code != 200:
                print(f"[LLMService] OpenAI codegen error: {resp.status_code}")
                return None
            text = resp.json()["choices"][0]["message"]["content"]
            return json.loads(text.strip())
        except Exception as e:
            print(f"[LLMService] OpenAI codegen exception: {e}")
            return None

    @staticmethod
    def _generate_static_template(name: str, description: str, slug: str) -> dict:
        """Rich static template that generates real runnable files for any project."""
        safe_name = name.replace('"', "'")
        safe_desc = description.replace('"', "'")

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{safe_name}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- Navigation -->
  <nav class="navbar">
    <div class="nav-brand">
      <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
        <polyline points="2 17 12 22 22 17"></polyline>
        <polyline points="2 12 12 17 22 12"></polyline>
      </svg>
      <span>{safe_name}</span>
    </div>
    <div class="nav-links">
      <a href="#features">Features</a>
      <a href="#dashboard">Dashboard</a>
      <a href="#api">API Status</a>
      <button class="btn-primary" onclick="document.getElementById('app-section').scrollIntoView({{behavior:'smooth'}})">Get Started</button>
    </div>
  </nav>

  <!-- Hero -->
  <section class="hero">
    <div class="hero-badge">
      <span class="pulse"></span>
      Live System
    </div>
    <h1>{safe_name}</h1>
    <p>{safe_desc}</p>
    <div class="hero-actions">
      <button class="btn-primary btn-lg" onclick="loadDashboard()">Open Dashboard</button>
      <button class="btn-secondary btn-lg" onclick="checkAPI()">Check API</button>
    </div>
    <div class="hero-stats" id="hero-stats">
      <div class="stat"><strong id="stat-users">—</strong><span>Users</span></div>
      <div class="stat"><strong id="stat-records">—</strong><span>Records</span></div>
      <div class="stat"><strong id="stat-uptime">99.9%</strong><span>Uptime</span></div>
    </div>
  </section>

  <!-- Main App Section -->
  <section class="app-section" id="app-section">
    <div class="section-header">
      <h2>Live Dashboard</h2>
      <div class="status-pill" id="api-status-pill">
        <span class="pulse"></span> Connecting...
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- Data Panel -->
      <div class="glass-card wide">
        <div class="card-header">
          <h3>Data Records</h3>
          <button class="btn-sm" onclick="fetchData()">Refresh</button>
        </div>
        <div id="data-table-container">
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading data from API...</p>
          </div>
        </div>
      </div>

      <!-- API Console -->
      <div class="glass-card">
        <div class="card-header">
          <h3>API Console</h3>
          <span class="badge-green" id="api-badge">OFFLINE</span>
        </div>
        <div class="api-console" id="api-console">
          <div class="console-row">
            <span class="console-prompt">$</span>
            <span class="console-text">Connecting to backend...</span>
          </div>
        </div>
        <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="btn-sm" onclick="callEndpoint('GET', '/')">GET /</button>
          <button class="btn-sm" onclick="callEndpoint('GET', '/items')">GET /items</button>
          <button class="btn-sm" onclick="callEndpoint('GET', '/health')">GET /health</button>
        </div>
      </div>

      <!-- Stats Panel -->
      <div class="glass-card">
        <div class="card-header"><h3>System Stats</h3></div>
        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-icon">⚡</div>
            <div><strong id="s-latency">—</strong><br><small>Latency (ms)</small></div>
          </div>
          <div class="stat-box">
            <div class="stat-icon">🔌</div>
            <div><strong id="s-endpoints">5</strong><br><small>Endpoints</small></div>
          </div>
          <div class="stat-box">
            <div class="stat-icon">🗄</div>
            <div><strong id="s-db">SQLite</strong><br><small>Database</small></div>
          </div>
          <div class="stat-box">
            <div class="stat-icon">🚀</div>
            <div><strong id="s-framework">FastAPI</strong><br><small>Framework</small></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <p>Generated by <strong>MissionOps AI</strong> · {safe_name} · <a href="http://localhost:8000/docs" target="_blank">API Docs →</a></p>
  </footer>

  <script>
    const API_BASE = 'http://localhost:8000';
    let apiOnline = false;

    async function checkAPI() {{
      const start = Date.now();
      try {{
        const res = await fetch(API_BASE + '/health');
        const latency = Date.now() - start;
        document.getElementById('s-latency').textContent = latency;
        if (res.ok) {{
          apiOnline = true;
          document.getElementById('api-status-pill').innerHTML = '<span class="pulse"></span> API Online';
          document.getElementById('api-status-pill').style.background = 'rgba(16,185,129,0.15)';
          document.getElementById('api-status-pill').style.color = '#10b981';
          document.getElementById('api-badge').textContent = 'ONLINE';
          document.getElementById('api-badge').style.background = '#10b981';
          logConsole('SUCCESS', 'Backend connected at ' + API_BASE);
          loadStats();
        }}
      }} catch(e) {{
        document.getElementById('api-status-pill').innerHTML = '<span class="pulse" style="background:#ef4444"></span> API Offline — Run: uvicorn main:app --reload';
        logConsole('WARN', 'Backend not reachable. Start it with: cd backend && uvicorn main:app --reload');
      }}
    }}

    async function fetchData() {{
      const container = document.getElementById('data-table-container');
      container.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading...</p></div>';
      try {{
        const res = await fetch(API_BASE + '/items');
        const data = await res.json();
        const items = data.items || data || [];
        if (items.length === 0) {{
          container.innerHTML = '<p style="color:#64748b;padding:1rem;">No records yet. POST to /items to add data.</p>';
          return;
        }}
        const keys = Object.keys(items[0]);
        container.innerHTML = `
          <table class="data-table">
            <thead><tr>${{keys.map(k => `<th>${{k}}</th>`).join('')}}</tr></thead>
            <tbody>${{items.map(row => `<tr>${{keys.map(k => `<td>${{row[k]}}</td>`).join('')}}</tr>`).join('')}}</tbody>
          </table>`;
        document.getElementById('stat-records').textContent = items.length;
      }} catch(e) {{
        container.innerHTML = '<p style="color:#ef4444;padding:1rem;">Cannot reach API. Make sure the backend is running.</p>';
      }}
    }}

    async function loadStats() {{
      try {{
        const res = await fetch(API_BASE + '/stats');
        const d = await res.json();
        if (d.users !== undefined) document.getElementById('stat-users').textContent = d.users;
        if (d.records !== undefined) document.getElementById('stat-records').textContent = d.records;
      }} catch(e) {{}}
    }}

    async function callEndpoint(method, path) {{
      const start = Date.now();
      try {{
        const res = await fetch(API_BASE + path, {{method}});
        const latency = Date.now() - start;
        const data = await res.json();
        document.getElementById('s-latency').textContent = latency;
        logConsole(res.ok ? 'SUCCESS' : 'ERROR', method + ' ' + path + ' → ' + res.status + ' (' + latency + 'ms)');
      }} catch(e) {{
        logConsole('ERROR', 'Failed: ' + method + ' ' + path);
      }}
    }}

    function logConsole(level, msg) {{
      const c = document.getElementById('api-console');
      const now = new Date().toLocaleTimeString();
      const colors = {{SUCCESS: '#10b981', ERROR: '#ef4444', WARN: '#f59e0b', INFO: '#38bdf8'}};
      const div = document.createElement('div');
      div.className = 'console-row';
      div.innerHTML = `<span class="console-time">${{now}}</span><span class="console-level" style="color:${{colors[level] || '#94a3b8'}}">${{level}}</span><span class="console-text">${{msg}}</span>`;
      c.appendChild(div);
      c.scrollTop = c.scrollHeight;
    }}

    function loadDashboard() {{
      document.getElementById('app-section').scrollIntoView({{behavior: 'smooth'}});
      fetchData();
    }}

    // Auto-connect on load
    window.addEventListener('load', () => {{
      checkAPI();
      setTimeout(fetchData, 500);
    }});
  </script>
</body>
</html>"""

        css = """/* ============================================================
   Generated by MissionOps AI
   ============================================================ */
* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --bg: #0a0f1e;
  --bg-card: rgba(255,255,255,0.04);
  --border: rgba(255,255,255,0.08);
  --accent: #6366f1;
  --cyan: #06b6d4;
  --green: #10b981;
  --text: #f1f5f9;
  --text-muted: #64748b;
  --font: 'Inter', system-ui, sans-serif;
}

body { font-family: var(--font); background: var(--bg); color: var(--text); min-height: 100vh; }

/* Navbar */
.navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 1rem 2rem; background: rgba(10,15,30,0.8); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); }
.nav-brand { display: flex; align-items: center; gap: 0.6rem; font-weight: 700; font-size: 1.1rem; color: var(--text); }
.nav-brand svg { color: var(--accent); }
.nav-links { display: flex; align-items: center; gap: 1.5rem; }
.nav-links a { color: var(--text-muted); text-decoration: none; font-size: 0.9rem; transition: color 0.2s; }
.nav-links a:hover { color: var(--text); }

/* Hero */
.hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; padding-top: 6rem; background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 70%); }
.hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.25); color: var(--accent); padding: 0.4rem 1rem; border-radius: 99px; font-size: 0.8rem; font-weight: 600; margin-bottom: 1.5rem; }
.hero h1 { font-size: clamp(2rem, 6vw, 4.5rem); font-weight: 800; letter-spacing: -0.04em; margin-bottom: 1rem; background: linear-gradient(135deg, #fff 40%, var(--accent) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero p { font-size: 1.15rem; color: var(--text-muted); max-width: 600px; line-height: 1.7; margin-bottom: 2rem; }
.hero-actions { display: flex; gap: 1rem; margin-bottom: 3rem; flex-wrap: wrap; justify-content: center; }
.hero-stats { display: flex; gap: 3rem; border-top: 1px solid var(--border); padding-top: 2rem; }
.stat { text-align: center; }
.stat strong { display: block; font-size: 1.8rem; font-weight: 700; color: var(--text); }
.stat span { font-size: 0.8rem; color: var(--text-muted); }

/* App section */
.app-section { padding: 4rem 2rem; max-width: 1200px; margin: 0 auto; }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; }
.section-header h2 { font-size: 1.75rem; font-weight: 700; }
.status-pill { display: flex; align-items: center; gap: 0.5rem; background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.2); color: var(--accent); padding: 0.4rem 0.9rem; border-radius: 99px; font-size: 0.82rem; font-weight: 600; transition: all 0.4s; }

/* Dashboard grid */
.dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
.glass-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 1.5rem; backdrop-filter: blur(8px); }
.glass-card.wide { grid-column: 1 / -1; }
.card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
.card-header h3 { font-size: 1rem; font-weight: 600; }

/* Buttons */
.btn-primary { background: var(--accent); color: #fff; border: none; padding: 0.55rem 1.2rem; border-radius: 8px; font-weight: 600; font-size: 0.88rem; cursor: pointer; transition: all 0.2s; font-family: inherit; }
.btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
.btn-primary.btn-lg { padding: 0.8rem 2rem; font-size: 1rem; border-radius: 10px; }
.btn-secondary { background: rgba(255,255,255,0.06); color: var(--text); border: 1px solid var(--border); padding: 0.55rem 1.2rem; border-radius: 8px; font-weight: 600; font-size: 0.88rem; cursor: pointer; transition: all 0.2s; font-family: inherit; }
.btn-secondary:hover { background: rgba(255,255,255,0.1); transform: translateY(-1px); }
.btn-secondary.btn-lg { padding: 0.8rem 2rem; font-size: 1rem; border-radius: 10px; }
.btn-sm { background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); color: var(--accent); padding: 0.3rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
.btn-sm:hover { background: var(--accent); color: #fff; }

/* Data table */
.data-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
.data-table th { text-align: left; padding: 0.6rem 0.75rem; color: var(--text-muted); font-weight: 600; font-size: 0.72rem; text-transform: uppercase; border-bottom: 1px solid var(--border); }
.data-table td { padding: 0.7rem 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.03); color: var(--text); }
.data-table tr:hover td { background: rgba(255,255,255,0.02); }

/* API console */
.api-console { background: #060a14; border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 1rem; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; height: 160px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.4rem; }
.console-row { display: flex; align-items: flex-start; gap: 0.6rem; }
.console-time { color: var(--text-muted); flex-shrink: 0; }
.console-prompt { color: var(--accent); flex-shrink: 0; }
.console-level { font-weight: 700; flex-shrink: 0; min-width: 60px; }
.console-text { color: #94a3b8; }

/* Stats grid */
.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.stat-box { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 10px; padding: 0.85rem; display: flex; align-items: center; gap: 0.75rem; }
.stat-icon { font-size: 1.25rem; }
.stat-box strong { font-size: 1rem; font-weight: 700; }
.stat-box small { color: var(--text-muted); font-size: 0.75rem; }

/* Badge */
.badge-green { background: rgba(16,185,129,0.15); color: var(--green); padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.72rem; font-weight: 700; transition: all 0.3s; }

/* Loading */
.loading-state { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 2rem; color: var(--text-muted); }
.spinner { width: 28px; height: 28px; border: 3px solid rgba(99,102,241,0.2); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Pulse dot */
.pulse { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: currentColor; animation: pulse 1.8s infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

/* Footer */
.footer { text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.85rem; border-top: 1px solid var(--border); }
.footer a { color: var(--accent); text-decoration: none; }

@media (max-width: 768px) {
  .dashboard-grid { grid-template-columns: 1fr; }
  .glass-card.wide { grid-column: 1; }
  .hero-stats { gap: 1.5rem; }
}"""

        backend_main = f"""\"\"\"
{safe_name} - FastAPI Backend
Generated by MissionOps AI
Run: uvicorn main:app --reload --port 8000
\"\"\"

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import time

app = FastAPI(
    title=\"{safe_name} API\",
    description=\"{safe_desc}\",
    version=\"1.0.0\"
)

# CORS - allow the frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── In-memory database (replace with SQLite/Postgres for production) ─────────
items_db = [
    {{"id": 1, "name": "Sample Record A", "status": "active", "created_at": "2026-08-01"}},
    {{"id": 2, "name": "Sample Record B", "status": "pending", "created_at": "2026-08-02"}},
    {{"id": 3, "name": "Sample Record C", "status": "completed", "created_at": "2026-08-03"}},
]
users_db = [
    {{"id": 1, "username": "admin", "email": "admin@example.com", "role": "admin"}},
    {{"id": 2, "username": "user1", "email": "user1@example.com", "role": "user"}},
]

# ─── Pydantic Models ──────────────────────────────────────────────────────────
class Item(BaseModel):
    name: str
    status: Optional[str] = "active"

class ItemResponse(BaseModel):
    id: int
    name: str
    status: str
    created_at: str

# ─── Routes ──────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {{
        "project": "{safe_name}",
        "description": "{safe_desc}",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }}

@app.get("/health")
def health_check():
    return {{"status": "healthy", "timestamp": datetime.utcnow().isoformat(), "uptime": "100%"}}

@app.get("/stats")
def get_stats():
    return {{
        "users": len(users_db),
        "records": len(items_db),
        "status": "operational"
    }}

@app.get("/items")
def get_items():
    return {{"items": items_db, "total": len(items_db)}}

@app.get("/items/{{item_id}}")
def get_item(item_id: int):
    item = next((i for i in items_db if i["id"] == item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@app.post("/items", status_code=201)
def create_item(item: Item):
    new_id = max(i["id"] for i in items_db) + 1 if items_db else 1
    new_item = {{
        "id": new_id,
        "name": item.name,
        "status": item.status,
        "created_at": datetime.utcnow().strftime("%Y-%m-%d")
    }}
    items_db.append(new_item)
    return new_item

@app.delete("/items/{{item_id}}")
def delete_item(item_id: int):
    global items_db
    item = next((i for i in items_db if i["id"] == item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    items_db = [i for i in items_db if i["id"] != item_id]
    return {{"message": "Deleted successfully"}}

@app.get("/users")
def get_users():
    return {{"users": users_db}}
"""

        models = f"""\"\"\"
SQLAlchemy ORM Models for {safe_name}
\"\"\"
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="user")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    items = relationship("Item", back_populates="owner")

class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(30), default="active")
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    owner = relationship("User", back_populates="items")
"""

        database_py = """\"\"\"
Database setup and session management.
\"\"\"
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./app.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
"""

        requirements = """fastapi>=0.104.0
uvicorn[standard]>=0.24.0
sqlalchemy>=2.0.0
pydantic>=2.0.0
python-multipart>=0.0.6
"""

        schema_sql = f"""-- {safe_name} Database Schema
-- Generated by MissionOps AI
-- Run: sqlite3 app.db < schema.sql

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(30) DEFAULT 'active',
    owner_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO users (username, email, hashed_password, role) VALUES
    ('admin', 'admin@example.com', 'hashed_admin_pw_here', 'admin'),
    ('user1', 'user1@example.com', 'hashed_user1_pw_here', 'user');

INSERT INTO items (name, description, status, owner_id) VALUES
    ('Sample Record A', 'First sample entry for {safe_name}', 'active', 1),
    ('Sample Record B', 'Second sample entry', 'pending', 1),
    ('Sample Record C', 'Third sample entry', 'completed', 2);
"""

        readme = f"""# {safe_name}

> {safe_desc}

Generated by **MissionOps AI** · Full-Stack Application

---

## Quick Start

### Frontend (opens instantly in browser)
```
Just double-click frontend/index.html
```
Or serve it:
```bash
cd frontend
python -m http.server 3000
# Open http://localhost:3000
```

### Backend API (Python FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API will be live at: http://localhost:8000  
Interactive docs at: http://localhost:8000/docs

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | / | Project info |
| GET | /health | Health check |
| GET | /items | List all items |
| GET | /items/{{id}} | Get single item |
| POST | /items | Create item |
| DELETE | /items/{{id}} | Delete item |
| GET | /users | List users |
| GET | /stats | System statistics |

---

## Project Structure
```
{slug}/
├── frontend/
│   ├── index.html       ← Open this in your browser
│   └── style.css        ← Stylesheet
├── backend/
│   ├── main.py          ← FastAPI application
│   ├── models.py        ← SQLAlchemy ORM models
│   ├── database.py      ← DB session setup
│   └── requirements.txt ← pip dependencies
├── database/
│   └── schema.sql       ← SQL DDL
└── README.md            ← This file
```

---

*Generated by MissionOps AI — {datetime.now().strftime("%Y-%m-%d")}*
"""

        from datetime import datetime as dt
        readme = readme.replace("datetime.now()", "").strip()
        readme += f"\n*Generated: {dt.utcnow().strftime('%Y-%m-%d %H:%M UTC')}*\n"

        return {{
            "frontend/index.html": html,
            "frontend/style.css": css,
            "backend/main.py": backend_main,
            "backend/models.py": models,
            "backend/database.py": database_py,
            "backend/requirements.txt": requirements,
            "database/schema.sql": schema_sql,
            "README.md": readme,
        }}
