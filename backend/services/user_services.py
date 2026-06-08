from sqlalchemy.ext.asyncio import AsyncSession

import auth
from crud import user_crud


async def authenticate_user(db: AsyncSession, email: str, password: str):
    user_obj = await user_crud.get_user_by_email(db, email)

    if not user_obj:
        return None
    
    if not auth.verify_password(password, user_obj.password):
        return None

    return user_obj


