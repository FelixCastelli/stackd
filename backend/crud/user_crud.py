from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
import models.user_model as user_model
from schemas.user_schema import UserCreate
import auth

async def create_user(db: AsyncSession, user: UserCreate):
    hashed_password = auth.hash_password(user.password)
    db_user = user_model.User(
        email = user.email,
        username = user.username,
        password = hashed_password
    )
    await db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def get_users(db: AsyncSession):
    result = await db.execute(select(user_model.User))
    return result.scalars().all()

async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(
        select(user_model.User).where(user_model.User.email == email)
    )
    return result.scalars().first()

async def authenticate_user(db: AsyncSession, email: str, password: str):
    user_obj = await get_user_by_email(db, email)
    if not user_obj:
        return None
    if not auth.verify_password(password, user_obj.password):
        return None
    return user_obj