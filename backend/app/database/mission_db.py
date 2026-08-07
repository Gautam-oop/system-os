from sqlalchemy import Column, String, Integer, Text
from sqlalchemy.dialects.postgresql import JSONB

from backend.app.database.user_db import Base, engine


class Mission(Base):
    __tablename__ = "missions"

    id = Column(String, primary_key=True)
    code_name = Column(String, nullable=False)
    name = Column(String, nullable=False)
    status = Column(String, nullable=False)
    commander_id = Column(String, nullable=False)
    started_at = Column(String, nullable=False)
    target_eta = Column(String, nullable=False)
    overall_progress = Column(Integer, default=0)
    active_members_count = Column(Integer, default=0)
    completed_tasks_count = Column(Integer, default=0)
    pending_tasks_count = Column(Integer, default=0)
    current_sprint = Column(String, nullable=False)
    sprint_days_remaining = Column(Integer, default=0)
    description = Column(Text, nullable=False)
    objectives = Column(JSONB, default=list)


def init_mission_db():
    Base.metadata.create_all(bind=engine)
