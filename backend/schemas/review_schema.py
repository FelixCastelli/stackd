from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field


class ReviewBase(BaseModel): # This is shared in the entire class, unless you overwrite it
    rating: Decimal = Field(..., ge=0.5, le=5)
    body: Optional[str] = None


class ReviewCreate(ReviewBase):
    igdb_id: int


class ReviewUpdate(BaseModel):
    rating: Optional[Decimal] = Field(None, ge=0.5, le=5)
    body: Optional[str] = None


class ReviewResponse(BaseModel):
    id: int
    user_id: int
    game_id: int
    rating: Decimal
    body: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True # This allows pydantic to read attributes from SQLAlchemy objects directly
