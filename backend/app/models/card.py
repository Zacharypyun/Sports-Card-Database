from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    playerName = Column(String, index=True)
    year = Column(Integer)
    brand = Column(String)
    setName = Column(String)
    sport = Column(String)
    cardNumber = Column(String)
    condition = Column(String)
    value = Column(Float, nullable=True)
    features = Column(JSON, default={})
    sold = Column(Boolean)
    front_image_url = Column(String, nullable=True)
    back_image_url = Column(String, nullable=True)
    createdAt = Column(DateTime, default=func.now())
    
    # Relationship with user
    user = relationship("User", back_populates="cards")