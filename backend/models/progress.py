from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP, ForeignKey, SmallInteger, JSON
from sqlalchemy.sql import func
from database import Base
import enum

class ProgressState(str, enum.Enum):
    not_started = "not_started"
    in_progress = "in_progress"
    completed = "completed"
    not_applicable = "not_applicable"

class ModuleProgressCurrent(Base):
    __tablename__ = "module_progress_current"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    module_id = Column(Integer, ForeignKey("roadmap_modules.id"), primary_key=True)
    progress_state = Column(Enum(ProgressState), default=ProgressState.not_started)
    percentage = Column(SmallInteger, default=0)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class EventType(str, enum.Enum):
    START = "START"
    PROGRESS_UPDATE = "PROGRESS_UPDATE"
    COMPLETE = "COMPLETE"
    TIME_LOG = "TIME_LOG"
    RESET = "RESET"

class ProgressEvent(Base):
    __tablename__ = "progress_events"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    module_id = Column(Integer, ForeignKey("roadmap_modules.id"), nullable=False)
    event_type = Column(Enum(EventType), nullable=False)
    old_progress_state = Column(String(20))
    new_progress_state = Column(String(20))
    percentage = Column(SmallInteger)
    duration_minutes = Column(SmallInteger)
    event_metadata = Column(JSON)
    created_at = Column(TIMESTAMP, server_default=func.now())


class AdminAuditLog(Base):
    __tablename__ = "admin_audit_log"
    id = Column(Integer, primary_key=True, autoincrement=True)
    admin_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(50))
    entity_id = Column(Integer)
    details = Column(JSON)
    created_at = Column(TIMESTAMP, server_default=func.now())