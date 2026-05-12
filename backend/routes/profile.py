from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from schemas.profile import ProfileSelect, ProfileOut
from services.roadmap_service import get_profiles, assign_profile
from middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/api/profile", tags=["profile"])

@router.get("/list", response_model=List[ProfileOut])
def list_profiles(db: Session = Depends(get_db)):
    profiles = get_profiles(db)
    # Map ORM fields to schema fields
    result = []
    for p in profiles:
        result.append({
            "id": p.id,
            "profile_key": p.profile_key,
            "name": p.name,
            "description": p.description,
            "min_weeks": p.default_duration_weeks_min,
            "max_weeks": p.default_duration_weeks_max
        })
    return result

@router.post("/select")
def select_profile(data: ProfileSelect, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        assign_profile(db, current_user.id, data.profile_id)
        return {"message": "Profile assigned, roadmap generated"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))