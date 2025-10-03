from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import User, SocialAccount
from ..schemas import SocialAccountCreate, SocialAccountResponse
from ..auth import get_current_active_user

router = APIRouter(prefix="/social-accounts", tags=["social accounts"])

@router.get("/", response_model=List[SocialAccountResponse])
async def get_social_accounts(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    accounts = db.query(SocialAccount).filter(SocialAccount.user_id == current_user.id).all()
    return accounts

@router.post("/", response_model=SocialAccountResponse)
async def create_social_account(
    account: SocialAccountCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    new_account = SocialAccount(
        user_id=current_user.id,
        platform=account.platform,
        account_name=account.account_name
    )
    db.add(new_account)
    db.commit()
    db.refresh(new_account)
    return new_account

@router.delete("/{account_id}")
async def delete_social_account(
    account_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    account = db.query(SocialAccount).filter(
        SocialAccount.id == account_id,
        SocialAccount.user_id == current_user.id
    ).first()
    
    if not account:
        raise HTTPException(status_code=404, detail="Social account not found")
    
    db.delete(account)
    db.commit()
    return {"message": "Social account deleted successfully"}

@router.patch("/{account_id}/toggle")
async def toggle_social_account(
    account_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    account = db.query(SocialAccount).filter(
        SocialAccount.id == account_id,
        SocialAccount.user_id == current_user.id
    ).first()
    
    if not account:
        raise HTTPException(status_code=404, detail="Social account not found")
    
    account.is_connected = not account.is_connected
    db.commit()
    db.refresh(account)
    return account
