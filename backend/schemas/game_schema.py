from pydantic import BaseModel


class GameResponse(BaseModel):
    id: int
    igdb_id: int
    name: str
    average_rating: float
    played_count: int
    playing_count: int
    backlogs_count: int
    wishlists_count: int
    ratings_count: int
    reviews_count: int
    likes_count: int

    class Config:
        from_attributes = True
