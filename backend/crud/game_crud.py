from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

import models.game_model as game_model


async def get_game_by_igdb_id(db: AsyncSession, igdb_id: int):
    return await db.scalar(
        select(game_model.Game).where(game_model.Game.igdb_id == igdb_id)
    )


async def create_game(db: AsyncSession, igdb_id: int, name: str):
    game = game_model.Game(
        igdb_id=igdb_id,
        name=name,
    )
    db.add(game)

    try:
        await db.commit()
    except IntegrityError:
        # Another request was made at the same time so it rolls back and grabs the game from the db.
        await db.rollback()

        existing_game = await get_game_by_igdb_id(db, igdb_id)

        if existing_game is None:
            raise
        
        return existing_game

    await db.refresh(game)
    return game