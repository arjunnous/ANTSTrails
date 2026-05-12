from pydantic import BaseModel
from typing import Optional

class ProfileOut(BaseModel):
    id: int
    profile_key: str
    name: str
    description: Optional[str]
    min_weeks: int
    max_weeks: int

class ProfileSelect(BaseModel):
    profile_id: int