from pydantic import BaseModel

class GameCreate(BaseModel):
    igdb_id: int
    name: str
