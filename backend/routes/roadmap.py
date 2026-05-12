from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.profile import UserProfile, ProfileState, Profile
from models.roadmap import ProfileModule, RoadmapModule
from models.progress import ModuleProgressCurrent
from schemas.roadmap import ModuleOut, RoadmapOut
from middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/api/roadmap", tags=["roadmap"])

@router.get("/", response_model=RoadmapOut)
def get_roadmap(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    # Find active user profile
    user_profile = db.query(UserProfile).filter(
        UserProfile.user_id == current_user.id,
        UserProfile.current_state == ProfileState.active
    ).first()
    if not user_profile:
        raise HTTPException(status_code=404, detail="No active roadmap. Please select a profile.")

    # Get profile name (fix: query Profile separately)
    profile = db.query(Profile).filter(Profile.id == user_profile.profile_id).first()
    profile_name = profile.name if profile else "Unknown"

    # Get all modules for this profile, ordered
    module_rows = (
        db.query(
            RoadmapModule,
            ProfileModule.sequence_order,
            ModuleProgressCurrent.progress_state,
            ModuleProgressCurrent.percentage
        )
        .join(ProfileModule, RoadmapModule.id == ProfileModule.module_id)
        .outerjoin(
            ModuleProgressCurrent,
            (ModuleProgressCurrent.module_id == RoadmapModule.id) &
            (ModuleProgressCurrent.user_id == current_user.id)
        )
        .filter(ProfileModule.profile_id == user_profile.profile_id)
        .order_by(ProfileModule.sequence_order)
        .all()
    )

    modules = []
    completed = 0
    for mod, seq, state, perc in module_rows:
        state = state or "not_started"
        perc = perc or 0
        if state == "completed":
            completed += 1
        modules.append(ModuleOut(
            id=mod.id,
            course_id=mod.course_id,
            title=mod.title,
            category=mod.category,
            mandatory=mod.mandatory,
            resource_name=mod.resource_name,
            platform=mod.platform,
            resource_link=mod.resource_link,
            estimated_time=mod.estimated_time,
            module_type=mod.module_type.value,
            sequence_order=seq,
            progress_state=state,
            percentage=perc
        ))

    total = len(modules)
    overall = int((completed / total) * 100) if total else 0
    return RoadmapOut(
        profile_name=profile_name,
        modules=modules,
        total_modules=total,
        completed_modules=completed,
        overall_percentage=overall
    )