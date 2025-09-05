#!/usr/bin/env python3
"""
Test script to verify database connection and create a test user
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, SessionLocal
from app.models.user import User
from app.models.card import Card
from app.auth.auth import hash_password
from sqlalchemy import text

def test_database_connection():
    """Test if we can connect to the database"""
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("✅ Database connection successful!")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def test_create_user():
    """Create a test user"""
    try:
        db = SessionLocal()
        
        # Check if test user already exists
        existing_user = db.query(User).filter(User.email == "test@example.com").first()
        if existing_user:
            print(f"✅ Test user already exists with ID: {existing_user.id}")
            return existing_user.id
        
        # Create test user
        test_user = User(
            email="test@example.com",
            username="testuser",
            password_hash=hash_password("password123")
        )
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        print(f"✅ Test user created successfully with ID: {test_user.id}")
        return test_user.id
        
    except Exception as e:
        print(f"❌ Error creating test user: {e}")
        return None
    finally:
        db.close()

def test_create_card(user_id):
    """Create a test card"""
    try:
        db = SessionLocal()
        
        # Create test card
        test_card = Card(
            user_id=user_id,
            playerName="Test Player",
            year=2023,
            brand="Test Brand",
            setName="Test Set",
            sport="Baseball",
            cardNumber="123",
            condition="Mint",
            sold=False
        )
        db.add(test_card)
        db.commit()
        db.refresh(test_card)
        
        print(f"✅ Test card created successfully with ID: {test_card.id}")
        return test_card.id
        
    except Exception as e:
        print(f"❌ Error creating test card: {e}")
        return None
    finally:
        db.close()

def main():
    print("🧪 Testing Sports Card Database...")
    print("=" * 50)
    
    # Test database connection
    if not test_database_connection():
        print("❌ Cannot proceed without database connection")
        return
    
    # Test user creation
    user_id = test_create_user()
    if not user_id:
        print("❌ Cannot proceed without a test user")
        return
    
    # Test card creation
    card_id = test_create_card(user_id)
    if not card_id:
        print("❌ Card creation failed")
        return
    
    print("=" * 50)
    print("🎉 All tests passed! Your database is working correctly.")
    print(f"Test user ID: {user_id}")
    print(f"Test card ID: {card_id}")

if __name__ == "__main__":
    main() 