from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal

class ReviewBase(BaseModel): # This is shared in the entire class, unless you overwrite it
    rating: Decimal = Field(..., ge=1, le=5)
    body: Optional[str] = None

class ReviewCreate(ReviewBase):
    game_id: int

class ReviewUpdate(BaseModel):
    rating: Optional[Decimal] = Field(None, ge=1, le=5)
    body: Optional[str] = None

class ReviewResponse(BaseModel):
    id: int
    user_id: int
    game_id: int
    rating: Decimal
    body: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True # This allows pydantic to read attributes from SQLAlchemy objects directly