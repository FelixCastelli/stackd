from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
import models.game_model as game_model

async def get_game_by_igdb_id(db: AsyncSession, igdb_id: int):
    result = await db.execute(
        select(game_model.Game).where(game_model.Game.igdb_id == igdb_id)
    )
    return result.scalars().first()


async def create_game_if_not_exists(db: AsyncSession, igdb_id: int, name: str):
    game = await get_game_by_igdb_id(db, igdb_id)

    if game:
        print("Game already exists in the database")
        return game

    game = game_model.Game(
        igdb_id=igdb_id,
        name=name
    )

    db.add(game)
    await db.commit()
    await db.refresh(game)
    return game
