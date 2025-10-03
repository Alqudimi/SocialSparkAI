from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    social_accounts = relationship("SocialAccount", back_populates="user", cascade="all, delete-orphan")
    content_preferences = relationship("ContentPreference", back_populates="user", cascade="all, delete-orphan", uselist=False)
    posts = relationship("Post", back_populates="user", cascade="all, delete-orphan")

class SocialAccount(Base):
    __tablename__ = "social_accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    platform = Column(String, nullable=False)
    account_name = Column(String, nullable=False)
    is_connected = Column(Boolean, default=True)
    access_token = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="social_accounts")

class ContentPreference(Base):
    __tablename__ = "content_preferences"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    topics = Column(JSON, default=list)
    hashtags = Column(JSON, default=list)
    posting_style = Column(String, default="professional")
    tone = Column(String, default="friendly")
    content_length = Column(String, default="medium")
    include_emojis = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="content_preferences")

class Post(Base):
    __tablename__ = "posts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    hashtags = Column(JSON, default=list)
    platforms = Column(JSON, default=list)
    scheduled_time = Column(DateTime, nullable=True)
    status = Column(String, default="draft")
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="posts")
