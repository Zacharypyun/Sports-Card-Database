from pydantic import BaseModel
from datetime import datetime

class UserCreate(BaseModel):
    email: str
    username : str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username :str
    createdAt: datetime