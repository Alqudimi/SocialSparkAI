from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    created_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class SocialAccountCreate(BaseModel):
    platform: str
    account_name: str

class SocialAccountResponse(BaseModel):
    id: int
    platform: str
    account_name: str
    is_connected: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class ContentPreferenceCreate(BaseModel):
    topics: List[str] = []
    hashtags: List[str] = []
    posting_style: str = "professional"
    tone: str = "friendly"
    content_length: str = "medium"
    include_emojis: bool = True

class ContentPreferenceResponse(BaseModel):
    id: int
    topics: List[str]
    hashtags: List[str]
    posting_style: str
    tone: str
    content_length: str
    include_emojis: bool
    
    class Config:
        from_attributes = True

class GenerateContentRequest(BaseModel):
    topic: Optional[str] = None
    platform: Optional[str] = None
    custom_prompt: Optional[str] = None

class GenerateContentResponse(BaseModel):
    content: str
    hashtags: List[str]
    generated_at: datetime

class PostCreate(BaseModel):
    content: str
    hashtags: List[str] = []
    platforms: List[str] = []
    scheduled_time: Optional[datetime] = None

class PostUpdate(BaseModel):
    content: Optional[str] = None
    hashtags: Optional[List[str]] = None
    platforms: Optional[List[str]] = None
    scheduled_time: Optional[datetime] = None
    status: Optional[str] = None

class PostResponse(BaseModel):
    id: int
    content: str
    hashtags: List[str]
    platforms: List[str]
    scheduled_time: Optional[datetime]
    status: str
    is_published: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
