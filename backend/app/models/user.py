from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String)
    password_hash = Column(String)
    createdAt = Column(DateTime, default=func.now())
    
    # Relationship with cards
    cards = relationship("Card", back_populates="user", cascade="all, delete-orphan")