from sqlalchemy import Column, String, Integer, Text
from sqlalchemy.dialects.postgresql import JSONB

from backend.app.database.user_db import Base, engine


class Agent(Base):
    __tablename__ = "agents"

    id = Column(String, primary_key=True)
    code = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    status = Column(String, nullable=False)
    avatar_bg = Column(String, nullable=False)
    avatar_color = Column(String, nullable=False)
    progress = Column(Integer, default=0)
    tasks_completed = Column(Integer, default=0)
    active_operation = Column(Text, nullable=True)
    current_task = Column(Text, nullable=True)
    capabilities = Column(JSONB, default=list)
    last_active = Column(String, nullable=False)


def init_agent_db():
    Base.metadata.create_all(bind=engine)


def seed_agents():
    from sqlalchemy.orm import sessionmaker

    Session = sessionmaker(bind=engine)
    db = Session()

    agents = [
        {
            "id": "agent-aura", "code": "AURA-01", "name": "Aura",
            "role": "Lead Frontend Engineer", "status": "Coding",
            "avatar_bg": "rgba(6, 182, 212, 0.12)", "avatar_color": "#0891b2",
            "progress": 85, "tasks_completed": 428,
            "active_operation": "Refactoring UI Components & Accessibility Standards",
            "current_task": "Refactoring UI Components & Accessibility Standards",
            "capabilities": ["React/Vite Architecture", "Design System UI", "a11y Compliance"],
            "last_active": "Just now"
        },
        {
            "id": "agent-titan", "code": "TITAN-02", "name": "Titan",
            "role": "Backend & Infrastructure Lead", "status": "Reviewing",
            "avatar_bg": "rgba(99, 102, 241, 0.15)", "avatar_color": "#6366f1",
            "progress": 92, "tasks_completed": 312,
            "active_operation": "Optimizing PostgreSQL Connection Pool & REST API",
            "current_task": "Optimizing PostgreSQL Connection Pool & REST API",
            "capabilities": ["Go/Python Microservices", "PostgreSQL Indexing", "GraphQL"],
            "last_active": "2s ago"
        },
        {
            "id": "agent-cipher", "code": "CIPHER-03", "name": "Cipher",
            "role": "Security & Auth Specialist", "status": "Idle",
            "avatar_bg": "rgba(16, 185, 129, 0.15)", "avatar_color": "#10b981",
            "progress": 100, "tasks_completed": 590,
            "active_operation": "Verifying OAuth2 Token Rotation Protocol",
            "current_task": "Verifying OAuth2 Token Rotation Protocol",
            "capabilities": ["JWT Authentication", "Zero-Trust Protocol", "Penetration Audit"],
            "last_active": "Just now"
        },
        {
            "id": "agent-vortex", "code": "VORTEX-04", "name": "Vortex",
            "role": "DevOps & CI/CD Engineer", "status": "Deploying",
            "avatar_bg": "rgba(249, 115, 22, 0.15)", "avatar_color": "#ea580c",
            "progress": 60, "tasks_completed": 215,
            "active_operation": "Automating Kubernetes Canary Deployment Pipeline",
            "current_task": "Automating Kubernetes Canary Deployment Pipeline",
            "capabilities": ["Docker & K8s", "GitHub Actions", "Terraform Infra"],
            "last_active": "5s ago"
        },
        {
            "id": "agent-spectre", "code": "SPECTRE-05", "name": "Spectre",
            "role": "QA & Test Automation Engineer", "status": "Testing",
            "avatar_bg": "rgba(59, 130, 246, 0.15)", "avatar_color": "#3b82f6",
            "progress": 45, "tasks_completed": 180,
            "active_operation": "Executing End-to-End Cypress Integration Suite",
            "current_task": "Executing End-to-End Cypress Integration Suite",
            "capabilities": ["Playwright & Cypress", "Regression Testing", "Load Testing"],
            "last_active": "1m ago"
        },
        {
            "id": "agent-nexus", "code": "NEXUS-06", "name": "Nexus",
            "role": "Data & ML Specialist", "status": "Training",
            "avatar_bg": "rgba(239, 68, 68, 0.15)", "avatar_color": "#dc2626",
            "progress": 78, "tasks_completed": 740,
            "active_operation": "Fine-Tuning Code Completion Embedding Model",
            "current_task": "Fine-Tuning Code Completion Embedding Model",
            "capabilities": ["Vector Indexing", "LLM Fine-Tuning", "Telemetry Models"],
            "last_active": "Just now"
        },
    ]

    try:
        for data in agents:
            existing = db.query(Agent).filter(Agent.id == data["id"]).first()
            if not existing:
                db.add(Agent(**data))
        db.commit()
        print("[*] Agents seeded successfully")
    finally:
        db.close()
