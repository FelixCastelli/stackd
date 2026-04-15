from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from dependencies import get_current_user
from schemas.review_schema import ReviewCreate, ReviewResponse
from crud.review_crud import create_review, get_review_by_user_and_game
from models.user_model import User

router = APIRouter(prefix="/reviews", tags=["reviews"])

@router.post("/", response_model=ReviewResponse)
async def create_review_route(
    review: ReviewCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    existing_review = await get_review_by_user_and_game(db, current_user.id, review.game_id)

    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already reviewed this game"
        )
    
    return await create_review(db, current_user.id, review)