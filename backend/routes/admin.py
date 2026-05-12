from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from database import get_db
from models.user import User, UserRole
from models.profile import UserProfile, ProfileState, Profile
from models.progress import ModuleProgressCurrent, ProgressState
from models.roadmap import ProfileModule
from middleware.auth_middleware import admin_required

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db), current_user: User = Depends(admin_required)):
    # Get all learners
    learners = db.query(User).filter(User.role == UserRole.learner, User.is_active == True).all()

    result = []
    for user in learners:
        # Find current active profile, else latest completed
        user_profile = db.query(UserProfile).filter(
            UserProfile.user_id == user.id,
            UserProfile.current_state == ProfileState.active
        ).first()
        if not user_profile:
            user_profile = db.query(UserProfile).filter(
                UserProfile.user_id == user.id
            ).order_by(UserProfile.updated_at.desc()).first()

        if not user_profile:
            continue  # skip users with no profiles yet

        # Count modules for this profile
        total_modules = db.query(func.count()).filter(
            ProfileModule.profile_id == user_profile.profile_id
        ).scalar() or 0

        completed_modules = db.query(func.count()).filter(
            ModuleProgressCurrent.user_id == user.id,
            ModuleProgressCurrent.progress_state == ProgressState.completed
        ).scalar() or 0

        # Calculate completion % (based on current profile's total modules)
        pct = int((completed_modules / total_modules) * 100) if total_modules > 0 else 0

        result.append({
            "user_id": user.id,
            "name": user.full_name,
            "email": user.email,
            "completion_pct": pct,
            "target_date": str(user_profile.target_end_date),
            "start_date": str(user_profile.start_date),
            "status": user_profile.current_state
        })

    return result