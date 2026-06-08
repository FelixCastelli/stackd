from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

import auth
import models.user_model as user_model
from schemas.user_schema import UserCreate


async def get_user_by_email(db: AsyncSession, email: str):
    normalized_email = email.strip().lower()

    return await db.scalar(
        select(user_model.User).where(user_model.User.email == normalized_email)
    )


async def get_user_by_username(db: AsyncSession, username: str):
    return await db.scalar(
        select(user_model.User).where(user_model.User.username == username)
    )


async def create_user(db: AsyncSession, user: UserCreate):
    hashed_password = auth.hash_password(user.password)

    db_user = user_model.User(
        email=user.email.strip().lower(),
        username=user.username,
        password=hashed_password,
    )

    db.add(db_user)

    try:
        await db.commit()
    except IntegrityError:
        # In case two or more users register a new user with the same email/username at the same time. (extremely rare)
        await db.rollback()
        return None

    await db.refresh(db_user)
    return db_user


async def get_users(db: AsyncSession):
    result = await db.execute(select(user_model.User))

    return result.scalars().all()


async def get_user_by_id(db: AsyncSession, user_id: int):
    return await db.scalar(
        select(user_model.User).where(user_model.User.id == user_id)
    )
