from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas.progress import ProgressUpdate
from models.progress import ModuleProgressCurrent, ProgressEvent, EventType
from models.roadmap import RoadmapModule
from middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/api/progress", tags=["progress"])

@router.put("/update")
def update_progress(data: ProgressUpdate, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    # Check module exists
    module = db.query(RoadmapModule).filter(RoadmapModule.id == data.module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    # Determine old state
    old = db.query(ModuleProgressCurrent).filter(
        ModuleProgressCurrent.user_id == current_user.id,
        ModuleProgressCurrent.module_id == data.module_id
    ).first()
    old_state = old.progress_state if old else "not_started"
    old_pct = old.percentage if old else 0

    # New values
    new_state = data.progress_state
    new_pct = data.percentage if data.percentage is not None else (100 if new_state == "completed" else old_pct)

    # UPSERT current progress
    db.merge(ModuleProgressCurrent(
        user_id=current_user.id,
        module_id=data.module_id,
        progress_state=new_state,
        percentage=new_pct
    ))

    # Log event
    event_type = EventType.START if (old_state == "not_started" and new_state == "in_progress") else \
                 EventType.COMPLETE if new_state == "completed" else EventType.PROGRESS_UPDATE
    ev = ProgressEvent(
        user_id=current_user.id,
        module_id=data.module_id,
        event_type=event_type,
        old_progress_state=old_state,
        new_progress_state=new_state,
        percentage=new_pct,
        duration_minutes=data.duration_minutes
    )
    db.add(ev)
    db.commit()

    # Recalculate overall percentage (optional)
    total = db.query(ModuleProgressCurrent).filter(ModuleProgressCurrent.user_id == current_user.id).count()
    completed = db.query(ModuleProgressCurrent).filter(
        ModuleProgressCurrent.user_id == current_user.id,
        ModuleProgressCurrent.progress_state == "completed"
    ).count()
    overall = int((completed / total) * 100) if total else 0

    return {"message": "Progress updated", "overall_percentage": overall}