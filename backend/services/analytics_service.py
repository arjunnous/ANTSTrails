from sqlalchemy.orm import Session
from models.user import User, UserRole
from models.profile import UserProfile, ProfileState
from models.progress import ModuleProgressCurrent
from sqlalchemy import func
from datetime import date, datetime

def get_overdue_users(db: Session):
    today = date.today()
    overdue_rows = db.query(UserProfile).filter(
        UserProfile.current_state.in_([ProfileState.active, ProfileState.overdue]),
        UserProfile.target_end_date < today
    ).all()
    return [
        {
            "user_id": row.user_id,
            "target_date": str(row.target_end_date),
            "start_date": str(row.start_date)
        }
        for row in overdue_rows
    ]

def get_completion_stats(db: Session):
    total_active = db.query(UserProfile).filter(UserProfile.current_state == ProfileState.active).count()
    total_completed = db.query(UserProfile).filter(UserProfile.current_state == ProfileState.completed).count()
    return {
        "active_learners": total_active,
        "completed_learners": total_completed,
        "overdue_learners": len(get_overdue_users(db))
    }