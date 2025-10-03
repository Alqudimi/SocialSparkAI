from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import UserResponse
from ..auth import get_current_active_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user
