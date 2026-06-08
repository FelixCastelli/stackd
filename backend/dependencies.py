from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from auth import decode_access_token, oauth2_scheme
from crud.user_crud import get_user_by_id
from database import get_db


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token)

    if payload is None:
        raise credentials_exception

    user_id_from_token = payload.get("sub")

    if user_id_from_token is None:
        raise credentials_exception

    try:
        user_id = int(user_id_from_token)
    except ValueError:
        raise credentials_exception

    user = await get_user_by_id(db, user_id)

    if user is None:
        raise credentials_exception

    return user
