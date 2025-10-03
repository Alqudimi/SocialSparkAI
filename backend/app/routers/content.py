from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import google.generativeai as genai
from ..database import get_db
from ..models import User, ContentPreference
from ..schemas import GenerateContentRequest, GenerateContentResponse
from ..auth import get_current_active_user
from ..config import settings

router = APIRouter(prefix="/content", tags=["content generation"])

def initialize_gemini():
    if settings.gemini_api_key:
        genai.configure(api_key=settings.gemini_api_key)
        return genai.GenerativeModel('gemini-2.5-flash')
    return None

@router.post("/generate", response_model=GenerateContentResponse)
async def generate_content(
    request: GenerateContentRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    preferences = db.query(ContentPreference).filter(
        ContentPreference.user_id == current_user.id
    ).first()
    
    if not preferences:
        raise HTTPException(status_code=404, detail="Please set your content preferences first")
    
    model = initialize_gemini()
    if not model:
        raise HTTPException(status_code=500, detail="Gemini API key not configured. Please add GEMINI_API_KEY to your environment.")
    
    topic = request.topic or (preferences.topics[0] if preferences.topics else "general topic")
    platform = request.platform or "social media"
    
    length_instructions = {
        "short": "Keep it under 100 characters",
        "medium": "Keep it between 100-200 characters",
        "long": "Keep it between 200-280 characters"
    }
    
    prompt = f"""Generate a {preferences.posting_style} {platform} post about {topic}.

Style Guidelines:
- Tone: {preferences.tone}
- Length: {length_instructions.get(preferences.content_length, 'medium length')}
- {'Include relevant emojis' if preferences.include_emojis else 'No emojis'}
- Posting style: {preferences.posting_style}

Additional requirements:
- Make it engaging and authentic
- Do not include hashtags in the main content
- Focus on providing value to the audience

Generate only the post content without any preamble or explanation."""

    if request.custom_prompt:
        prompt = request.custom_prompt
    
    try:
        response = model.generate_content(prompt)
        content = response.text.strip()
        
        hashtag_prompt = f"Generate 3-5 relevant hashtags for this {platform} post about {topic}. Return only the hashtags separated by spaces, starting with #."
        hashtag_response = model.generate_content(hashtag_prompt)
        hashtags_text = hashtag_response.text.strip()
        hashtags = [tag.strip() for tag in hashtags_text.split() if tag.startswith('#')]
        
        if not hashtags and preferences.hashtags:
            hashtags = [f"#{tag}" if not tag.startswith('#') else tag for tag in preferences.hashtags[:3]]
        
        return GenerateContentResponse(
            content=content,
            hashtags=hashtags,
            generated_at=datetime.utcnow()
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating content: {str(e)}")
