import asyncio

from fastapi import HTTPException
import httpx
from sqlalchemy.ext.asyncio import AsyncSession

from crud import game_crud
from services.igdb_service import IGDB_POPULARITY_URL, igdb_post

GAME_SEARCH_LIMIT = 20


async def fetch_newest_top_selling_steam_games(limit: int):
    popularity_limit = limit * 2 # I bring more in case it brings DLCs, so that I have the space to remove those and add the remaining that aren't Main Games or Expansions below.

    body = f"""
    fields game_id; 
    where popularity_type = 9 & external_popularity_source = 1;
    sort value desc;
    limit {popularity_limit};
    """

    try:
        popular_games = await igdb_post(body, url=IGDB_POPULARITY_URL)
        popular_game_ids = [game["game_id"] for game in popular_games]

        if not popular_game_ids:
            return []

        # Sort them by release date so the newest released games show up first.
        popular_game_ids_query = ", ".join(map(str, popular_game_ids))
        games_body = f"""
            fields name, cover.url, game_type, first_release_date;
            where id = ({popular_game_ids_query}) & game_type = (0, 2);
            sort first_release_date desc;
            limit {limit};
        """

        return await igdb_post(games_body)
    except httpx.HTTPError:
        raise HTTPException(
            status_code=502,
            detail="Unable to fetch games from IGDB",
        )


async def search_igdb_games(query: str, limit: int = GAME_SEARCH_LIMIT):
    query = query.strip()

    if len(query) < 2:
        return []

    safe_query = query.replace("\\", "\\\\").replace('"', '\\"')

    # This search is the igdb built-in query which searches for relevance.
    search_body = f"""
    search "{safe_query}";
    fields name, first_release_date, game_type;
    where game_type = (0, 2, 4, 8, 14) & version_parent = null;
    limit {limit};
    """

    # This search looks for games that might be related to the main search query.
    partial_match_body = f"""
    fields name, first_release_date, game_type;
    where name ~ *"{safe_query}"*
        & game_type = (0, 2, 4, 8, 14)
        & version_parent = null;
    limit {limit};
    """

    try:
        search_games, partial_match_games = await asyncio.gather(
            igdb_post(search_body),
            igdb_post(partial_match_body),
        )

        games = merge_unique_games(search_games, partial_match_games)
        return games[:limit]
    except httpx.HTTPError:
        raise HTTPException(
            status_code=502,
            detail="Unable to search games from IGDB",
        )


async def fetch_igdb_game_details(igdb_id: int):
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
    where id = {igdb_id};
    """

    try:
        data = await igdb_post(body)

        if not data:
            raise HTTPException(status_code=404, detail="Game not found")

        game_data = data[0]

        return game_data
    except httpx.HTTPError:
        raise HTTPException(
            status_code=502,
            detail="Unable to fetch game details from IGDB",
        )


async def create_game_from_igdb(db: AsyncSession, igdb_id: int):
    existing_game = await game_crud.get_game_by_igdb_id(db, igdb_id)

    if existing_game:
        return existing_game
    
    game_data = await fetch_igdb_game_details(igdb_id)

    return await game_crud.create_game(
        db=db,
        igdb_id=igdb_id,
        name=game_data["name"],
    )


def merge_unique_games(*game_lists):
    # Deletes duplicate games that appear when searching both queries.
    games_by_id = {}

    for games in game_lists:
        for game in games:
            games_by_id[game["id"]] = game

    return list(games_by_id.values())
