from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import Card, CardResponse
from sqlalchemy.orm import Session
from app.database import get_db, engine
from app.models.card import Card as DBCard, Base
from app.schemas.user import UserCreate, UserResponse
from app.models.user import User
from app.auth.auth import create_user, get_user_by_email, verify_password
from typing import List
import shutil
import os
from uuid import uuid4
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create the database tables
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")
except Exception as e:
    logger.error(f"Error creating database tables: {e}")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files (images)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/cards", response_model=CardResponse)
def createCard(card: Card, db: Session = Depends(get_db)):
    try:
        # First, validate that the user exists
        user = db.query(User).filter(User.id == card.user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail=f"User with id {card.user_id} not found")
        
        # Handle image URLs - if they're base64 data URLs, save them as files
        front_image_url = card.front_image_url
        back_image_url = card.back_image_url
        
        if front_image_url and front_image_url.startswith('data:image/'):
            # Save base64 image as file
            import base64
            import uuid
            from pathlib import Path
            
            # Extract the base64 data
            header, data = front_image_url.split(',', 1)
            image_data = base64.b64decode(data)
            
            # Generate unique filename
            filename = f"front_{uuid.uuid4()}.jpg"
            filepath = Path("static/images") / filename
            
            # Ensure directory exists
            filepath.parent.mkdir(parents=True, exist_ok=True)
            
            # Save the file
            with open(filepath, "wb") as f:
                f.write(image_data)
            
            front_image_url = f"/static/images/{filename}"
        
        if back_image_url and back_image_url.startswith('data:image/'):
            # Save base64 image as file
            import base64
            import uuid
            from pathlib import Path
            
            # Extract the base64 data
            header, data = back_image_url.split(',', 1)
            image_data = base64.b64decode(data)
            
            # Generate unique filename
            filename = f"back_{uuid.uuid4()}.jpg"
            filepath = Path("static/images") / filename
            
            # Ensure directory exists
            filepath.parent.mkdir(parents=True, exist_ok=True)
            
            # Save the file
            with open(filepath, "wb") as f:
                f.write(image_data)
            
            back_image_url = f"/static/images/{filename}"
        
        # Create the card with processed image URLs
        card_data = card.dict()
        card_data['front_image_url'] = front_image_url
        card_data['back_image_url'] = back_image_url
        
        db_card = DBCard(**card_data)
        db.add(db_card)
        db.commit()
        db.refresh(db_card)
        logger.info(f"Card created successfully for user {card.user_id}")
        return db_card
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating card: {e}")
        raise HTTPException(status_code=400, detail=f"Error creating card: {str(e)}")


@app.get("/cards", response_model=List[CardResponse])  # Fixed this line
def getCards(db: Session = Depends(get_db)):
    cards = db.query(DBCard).all()
    return cards

@app.get("/cards/{card_id}", response_model=CardResponse)
def getCard(card_id: int, db: Session = Depends(get_db)):
    card = db.query(DBCard).filter(DBCard.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    return card

@app.delete("/cards/{card_id}")
def deleteCard(card_id: int, db: Session = Depends(get_db)):
    card = db.query(DBCard).filter(DBCard.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    
    db.delete(card)
    db.commit()
    return {"message": f"Card {card_id} deleted successfully"}

@app.put("/cards/{card_id}", response_model=CardResponse)
def updateCard(card_id: int, card: Card, db: Session = Depends(get_db)):
    try:
        # Find the existing card
        db_card = db.query(DBCard).filter(DBCard.id == card_id).first()
        if not db_card:
            raise HTTPException(status_code=404, detail="Card not found")
        
        # Handle image URLs - if they're base64 data URLs, save them as files
        front_image_url = card.front_image_url
        back_image_url = card.back_image_url
        
        if front_image_url and front_image_url.startswith('data:image/'):
            # Save base64 image as file
            import base64
            import uuid
            from pathlib import Path
            
            # Extract the base64 data
            header, data = front_image_url.split(',', 1)
            image_data = base64.b64decode(data)
            
            # Generate unique filename
            filename = f"front_{uuid.uuid4()}.jpg"
            filepath = Path("static/images") / filename
            
            # Ensure directory exists
            filepath.parent.mkdir(parents=True, exist_ok=True)
            
            # Save the file
            with open(filepath, "wb") as f:
                f.write(image_data)
            
            front_image_url = f"/static/images/{filename}"
        
        if back_image_url and back_image_url.startswith('data:image/'):
            # Save base64 image as file
            import base64
            import uuid
            from pathlib import Path
            
            # Extract the base64 data
            header, data = back_image_url.split(',', 1)
            image_data = base64.b64decode(data)
            
            # Generate unique filename
            filename = f"back_{uuid.uuid4()}.jpg"
            filepath = Path("static/images") / filename
            
            # Ensure directory exists
            filepath.parent.mkdir(parents=True, exist_ok=True)
            
            # Save the file
            with open(filepath, "wb") as f:
                f.write(image_data)
            
            back_image_url = f"/static/images/{filename}"
        
        # Update the card with processed image URLs
        card_data = card.dict()
        card_data['front_image_url'] = front_image_url
        card_data['back_image_url'] = back_image_url
        
        # Update all fields
        for key, value in card_data.items():
            setattr(db_card, key, value)
        
        db.commit()
        db.refresh(db_card)
        logger.info(f"Card {card_id} updated successfully")
        return db_card
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating card: {e}")
        raise HTTPException(status_code=400, detail=f"Error updating card: {str(e)}")

@app.post("/users/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    return create_user(db=db, user=user)

@app.post("/users/login")
def login_user(data: dict, db: Session = Depends(get_db)):
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password required")
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"id": user.id, "username": user.username, "email": user.email}

@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # First, delete all cards belonging to this user
    user_cards = db.query(DBCard).filter(DBCard.user_id == user_id).all()
    for card in user_cards:
        db.delete(card)
    
    # Then delete the user
    db.delete(user)
    db.commit()
    
    return {"message": f"User {user_id} and {len(user_cards)} associated cards deleted successfully"}

@app.post("/cards/{card_id}/upload-image")
def upload_card_image(
    card_id: int,
    image_type: str,  # "front" or "back"
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Check if card exists
    card = db.query(DBCard).filter(DBCard.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    
    # Validate image type
    if image_type not in ["front", "back"]:
        raise HTTPException(status_code=400, detail="image_type must be 'front' or 'back'")
    
    # Generate unique filename
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid4()}.{file_extension}"
    file_path = f"static/images/{unique_filename}"
    
    # Save the file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Update card with image URL
    image_url = f"/static/images/{unique_filename}"
    if image_type == "front":
        card.front_image_url = image_url
    else:
        card.back_image_url = image_url
    
    db.commit()
    
    return {"message": f"{image_type} image uploaded successfully", "image_url": image_url}