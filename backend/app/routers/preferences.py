from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, ContentPreference
from ..schemas import ContentPreferenceCreate, ContentPreferenceResponse
from ..auth import get_current_active_user

router = APIRouter(prefix="/preferences", tags=["content preferences"])

@router.get("/", response_model=ContentPreferenceResponse)
async def get_content_preferences(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    preferences = db.query(ContentPreference).filter(
        ContentPreference.user_id == current_user.id
    ).first()
    
    if not preferences:
        raise HTTPException(status_code=404, detail="Content preferences not found")
    
    return preferences

@router.put("/", response_model=ContentPreferenceResponse)
async def update_content_preferences(
    preferences_data: ContentPreferenceCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    preferences = db.query(ContentPreference).filter(
        ContentPreference.user_id == current_user.id
    ).first()
    
    if not preferences:
        preferences = ContentPreference(user_id=current_user.id)
        db.add(preferences)
    
    preferences.topics = preferences_data.topics
    preferences.hashtags = preferences_data.hashtags
    preferences.posting_style = preferences_data.posting_style
    preferences.tone = preferences_data.tone
    preferences.content_length = preferences_data.content_length
    preferences.include_emojis = preferences_data.include_emojis
    
    db.commit()
    db.refresh(preferences)
    return preferences
