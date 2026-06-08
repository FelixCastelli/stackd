import httpx

from config import settings

IGDB_GAMES_URL = "https://api.igdb.com/v4/games"
IGDB_POPULARITY_URL = "https://api.igdb.com/v4/popularity_primitives"


def get_igdb_headers():
    return {
        "Client-ID": settings.IGDB_CLIENT_ID,
        "Authorization": f"Bearer {settings.IGDB_ACCESS_TOKEN}",
    }


async def igdb_post(body: str, url: str = IGDB_GAMES_URL):
    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.post(url, headers=get_igdb_headers(), data=body)
        response.raise_for_status()
        return response.json()
