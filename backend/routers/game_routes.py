from fastapi import APIRouter, Query
import httpx
from config import settings

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
    where popularity_type = 5;
    sort value desc;
    limit {limit};
    """

    async with httpx.AsyncClient(timeout=20.0) as client: # Timeout is the time limit for the request so that the app doesn't hang indefinitely
        popularity_resp = await client.post(IGDB_POPULARITY_URL, headers=headers, data=body) # The = are because the request needs to be asigned to a variable
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

# async def fetch_games(limit: int = 10, game_ids: list[int] = None):
#     headers = {
#         "Client-ID": settings.IGDB_CLIENT_ID,
#         "Authorization": f"Bearer {settings.IGDB_ACCESS_TOKEN}",
#     }

#     body = f"""
#         fields name, cover.url, rating, game_type;
#         where id = ({', '.join(map(str, game_ids))});
#         limit {limit};
#     """

#     async with httpx.AsyncClient(timeout=20.0) as client:
#         response = await client.post(IGDB_GAMES_URL, headers=headers, data=body)
#         response.raise_for_status()
#         return response.json()