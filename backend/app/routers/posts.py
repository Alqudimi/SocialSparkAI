from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..database import get_db
from ..models import User, Post
from ..schemas import PostCreate, PostUpdate, PostResponse
from ..auth import get_current_active_user

router = APIRouter(prefix="/posts", tags=["posts"])

@router.get("/", response_model=List[PostResponse])
async def get_posts(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    posts = db.query(Post).filter(Post.user_id == current_user.id).order_by(Post.created_at.desc()).all()
    return posts

@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(
        Post.id == post_id,
        Post.user_id == current_user.id
    ).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    return post

@router.post("/", response_model=PostResponse)
async def create_post(
    post_data: PostCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    new_post = Post(
        user_id=current_user.id,
        content=post_data.content,
        hashtags=post_data.hashtags,
        platforms=post_data.platforms,
        scheduled_time=post_data.scheduled_time,
        status="scheduled" if post_data.scheduled_time else "draft"
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

@router.patch("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: int,
    post_data: PostUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(
        Post.id == post_id,
        Post.user_id == current_user.id
    ).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if post_data.content is not None:
        post.content = post_data.content
    if post_data.hashtags is not None:
        post.hashtags = post_data.hashtags
    if post_data.platforms is not None:
        post.platforms = post_data.platforms
    if post_data.scheduled_time is not None:
        post.scheduled_time = post_data.scheduled_time
        post.status = "scheduled"
    if post_data.status is not None:
        post.status = post_data.status
    
    post.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(post)
    return post

@router.delete("/{post_id}")
async def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(
        Post.id == post_id,
        Post.user_id == current_user.id
    ).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    db.delete(post)
    db.commit()
    return {"message": "Post deleted successfully"}

@router.post("/{post_id}/publish")
async def publish_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(
        Post.id == post_id,
        Post.user_id == current_user.id
    ).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    post.is_published = True
    post.status = "published"
    db.commit()
    db.refresh(post)
    
    return {"message": "Post published successfully", "post": post}
