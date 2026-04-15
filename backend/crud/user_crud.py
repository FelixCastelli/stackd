from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import or_
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
    db.add(db_user)
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

async def get_user_by_login(db: AsyncSession, login_input: str):
    result = await db.execute(select(user_model.User).where(or_(
        user_model.User.email == login_input,
        user_model.User.username == login_input
    )))
    return result.scalars().first()

async def get_user_by_id(db: AsyncSession, id: int):
    result = await db.execute(
        select(user_model.User).where(user_model.User.id == id)
    )
    return result.scalars().first()

async def authenticate_user(db: AsyncSession, login_input: str, password: str):
    user_obj = await get_user_by_login(db, login_input)
    if not user_obj:
        return None
    if not auth.verify_password(password, user_obj.password):
        return None
    return user_obj