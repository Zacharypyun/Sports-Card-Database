from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class Card(BaseModel):
    user_id: int
    playerName: str
    year: int
    brand: str
    setName: str
    sport: str
    cardNumber: str
    features: Dict[str, Any] = {}
    condition: str
    value: Optional[float] = None
    sold: bool = False
    front_image_url: Optional[str] = None
    back_image_url: Optional[str] = None
    
class CardResponse(BaseModel):
    id: int
    user_id: int
    playerName: str
    year: int
    brand: str
    setName: str
    sport: str
    cardNumber: str
    features: Dict[str, Any] = {}
    condition: str
    value: Optional[float] = None
    sold: bool = False
    front_image_url: Optional[str] = None
    back_image_url: Optional[str] = None
    createdAt: datetime