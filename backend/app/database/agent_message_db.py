from datetime import datetime, timezone

from sqlalchemy import Column, String, Text, DateTime

from backend.app.database.user_db import Base, engine


class AgentMessage(Base):
    __tablename__ = "agent_messages"

    id = Column(String, primary_key=True)
    sender_agent_id = Column(String, nullable=True, index=True)
    sender_name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    mission_id = Column(String, nullable=True, index=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


def init_agent_message_db():
    Base.metadata.create_all(bind=engine)
