from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from schemas.game_schema import GameResponse
from services import game_services

router = APIRouter(prefix="/games", tags=["games"])


@router.get("/")
async def get_trending_steam_games():
    games = await game_services.fetch_newest_top_selling_steam_games(60)
    return games


@router.get("/search")
async def search_game_by_query(query: str):
    return await game_services.search_igdb_games(query)


@router.get("/{igdb_id}")
async def fetch_game_details(igdb_id: int):
    return await game_services.fetch_igdb_game_details(igdb_id)


@router.put("/{igdb_id}", response_model=GameResponse)
async def create_game(igdb_id: int, db: AsyncSession = Depends(get_db)):
    return await game_services.create_game_from_igdb(db=db, igdb_id=igdb_id)
