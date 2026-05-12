from sqlalchemy import Column, Integer, String, Text, Enum, Date, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from database import Base
import enum

class ProfileState(str, enum.Enum):
    active = "active"
    completed = "completed"
    overdue = "overdue"
    paused = "paused"

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True, autoincrement=True)
    profile_key = Column(String(30), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    default_duration_weeks_min = Column(Integer, nullable=False)
    default_duration_weeks_max = Column(Integer, nullable=False)
    sort_order = Column(Integer, default=0)

class UserProfile(Base):
    __tablename__ = "user_profiles"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)
    current_state = Column(Enum(ProfileState), default=ProfileState.active, nullable=False)
    start_date = Column(Date, nullable=False)
    target_end_date = Column(Date, nullable=False)
    completed_at = Column(TIMESTAMP, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())