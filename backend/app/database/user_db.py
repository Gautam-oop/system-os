"""
==========================================================================
MISSIONOS FASTAPI BACKEND - USER DATABASE
==========================================================================
"""

import os
import uuid
from datetime import datetime, timezone
from sqlalchemy import create_engine, Column, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Resolve db file path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if os.environ.get("VERCEL"):
    DATABASE_URL = "sqlite:////tmp/mission_ops_users.db"
else:
    DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'mission_ops_users.db')}"

DATABASE_URL = os.getenv("DATABASE_URL") or DATABASE_URL

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    role = Column(String, default="user")
    avatar = Column(String, nullable=True)

def init_db():
    """
    Initialize the database, create tables, and seed default user.
    """
    Base.metadata.create_all(bind=engine)
    
    # Seed default user if not exists
    db = SessionLocal()
    try:
        admin_email = "admin@missionops.dev"
        admin_user = db.query(User).filter(User.email == admin_email).first()
        if not admin_user:
            from backend.app.utils.password import hash_password
            
            new_admin = User(
                id=f"usr_{uuid.uuid4().hex[:12]}",
                name="Eleanor Vance",
                email=admin_email,
                hashed_password=hash_password("password123"),
                created_at=datetime.utcnow(),
                last_login=None,
                role="admin",
                avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
            )
            db.add(new_admin)
            db.commit()
            print("[*] Seeded default administrator account: admin@missionops.dev / password123")
    except Exception as e:
        print(f"[!] Database seeding failed: {e}")
        db.rollback()
    finally:
        db.close()

def get_db():
    """
    Dependency to yield database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
