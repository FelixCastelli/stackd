from sqlalchemy import Column, Integer, Numeric, Text, DateTime, ForeignKey, UniqueConstraint, func
from database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    game_id = Column(Integer, ForeignKey("games.id", ondelete="CASCADE"), index=True, nullable=False)

    rating = Column(Numeric(3, 2), nullable=False)
    body = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    __table_args__ = (UniqueConstraint("user_id", "game_id", name="uq_user_game_review"),)