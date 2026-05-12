from sqlalchemy import Column, Integer, String, Text, Enum, ForeignKey, Boolean, SmallInteger
from database import Base
import enum

class ModuleType(str, enum.Enum):
    course = "course"
    project = "project"

class RoadmapModule(Base):
    __tablename__ = "roadmap_modules"
    id = Column(Integer, primary_key=True, autoincrement=True)
    course_id = Column(String(60), unique=True, nullable=False)
    title = Column(String(200), nullable=False)
    category = Column(String(50), nullable=False)
    mandatory = Column(Boolean, default=False)
    resource_name = Column(String(200))
    platform = Column(String(100))
    resource_link = Column(String(500), nullable=False)
    estimated_time = Column(String(30))
    module_type = Column(Enum(ModuleType), default=ModuleType.course)

class ProfileModule(Base):
    __tablename__ = "profile_modules"
    id = Column(Integer, primary_key=True, autoincrement=True)
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)
    module_id = Column(Integer, ForeignKey("roadmap_modules.id"), nullable=False)
    sequence_order = Column(SmallInteger, nullable=False, default=0)