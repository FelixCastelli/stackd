from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import models.review_model as review_model
from schemas.review_schema import ReviewCreate

async def create_review(db: AsyncSession, user_id: int, review: ReviewCreate):
    db_review = review_model.Review(
        user_id = user_id,
        game_id = review.game_id,
        rating = review.rating,
        body = review.body
    )
    db.add(db_review)
    await db.commit()
    await db.refresh(db_review)
    return db_review

async def get_review_by_user_and_game(db: AsyncSession, user_id: int, game_id: int):
    result = await db.execute(
        select(review_model.Review).where(
            review_model.Review.user_id == user_id,
            review_model.Review.game_id == game_id
        )
    )

    print("Querying with:", user_id, game_id)

    return result.scalars().first()