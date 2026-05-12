from pydantic import BaseModel
from typing import Optional

class ProgressUpdate(BaseModel):
    module_id: int
    progress_state: str  # "not_started", "in_progress", "completed"
    percentage: Optional[int] = None
    duration_minutes: Optional[int] = None