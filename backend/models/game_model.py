from sqlalchemy import Column, Integer, Float, String
from database import Base

class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, index=True)

    igdb_id = Column(Integer, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)

    average_rating = Column(Float, default=0.0)

    played_count = Column(Integer, default=0)
    playing_count = Column(Integer, default=0)
    backlogs_count = Column(Integer, default=0)
    wishlists_count = Column(Integer, default=0)

    ratings_count = Column(Integer, default=0)
    reviews_count = Column(Integer, default=0)
    likes_count = Column(Integer, default=0)
