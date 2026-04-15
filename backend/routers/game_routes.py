from fastapi import APIRouter, Depends
import httpx
from config import settings
from schemas.game_schema import GameCreate
from database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from crud.game_crud import create_game_if_not_exists, get_game_by_igdb_id

router = APIRouter(prefix="/games", tags=["games"])
popular_steam_games = []

IGDB_GAMES_URL = "https://api.igdb.com/v4/games"
IGDB_POPULARITY_URL = "https://api.igdb.com/v4/popularity_primitives"

async def fetch_top_steam_games(limit: int = 60):
    headers = {
        "Client-ID": settings.IGDB_CLIENT_ID,
        "Authorization": f"Bearer {settings.IGDB_ACCESS_TOKEN}",
    }

    body = f"""
    fields game_id; 
    where popularity_type = 3;
    sort value desc;
    limit {limit};
    """

    async with httpx.AsyncClient(timeout=20.0) as client:
        popularity_resp = await client.post(IGDB_POPULARITY_URL, headers=headers, data=body)
        popularity_resp.raise_for_status()
        popular_game_ids = [game['game_id'] for game in popularity_resp.json()]
        
        if not popular_game_ids:
            return []
        
        games_body = f"""
            fields name, cover.url, rating, game_type, first_release_date;
            where id = ({', '.join(map(str, popular_game_ids))});
            sort first_release_date desc;
            limit {limit};
        """

        games_resp = await client.post(IGDB_GAMES_URL, headers=headers, data=games_body)
        games_resp.raise_for_status()
        return games_resp.json()
    
@router.get("/")
async def get_trending_steam_games(limit: int = 60):
    games = await fetch_top_steam_games(limit)
    return games

@router.get("/{game_id}")
async def get_game_details(game_id: int):
    headers = {
        "Client-ID": settings.IGDB_CLIENT_ID,
        "Authorization": f"Bearer {settings.IGDB_ACCESS_TOKEN}",
    }

    body = f"""
    fields name,
    cover.url,
    screenshots.url,
    game_type.type,
    first_release_date,
    summary,
    genres.name,
    platforms.name,
    involved_companies.company.name,
    game_status.status,
    dlcs,
    expansions,
    expanded_games,
    franchises.games,
    parent_game;
    where id = {game_id};
    """

    async with httpx.AsyncClient(timeout=20.0) as client:
        game_resp = await client.post(IGDB_GAMES_URL, headers=headers, data=body)
        game_resp.raise_for_status()
        data = game_resp.json()

        if not data:
            return { "error": "Game not found" }
        
        return data[0]

@router.post("/")
async def ensure_game_exists(
    payload: GameCreate,
    db: AsyncSession = Depends(get_db)
):
    game = await create_game_if_not_exists(
        db, 
        payload.igdb_id,
        payload.name
        )
    return game
