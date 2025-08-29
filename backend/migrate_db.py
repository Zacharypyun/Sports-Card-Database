#!/usr/bin/env python3
"""
Database migration script to add missing columns to existing tables
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, SessionLocal
from sqlalchemy import text
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_table_structure():
    """Check the current structure of the cards table"""
    try:
        with engine.connect() as connection:
            # Check if cards table exists
            result = connection.execute(text("""
                SELECT column_name, data_type, is_nullable 
                FROM information_schema.columns 
                WHERE table_name = 'cards' 
                ORDER BY ordinal_position
            """))
            
            columns = result.fetchall()
            logger.info("Current cards table structure:")
            for col in columns:
                logger.info(f"  {col[0]}: {col[1]} (nullable: {col[2]})")
            
            return [col[0] for col in columns]
            
    except Exception as e:
        logger.error(f"Error checking table structure: {e}")
        return []

def add_missing_columns():
    """Add missing columns to the cards table"""
    try:
        with engine.connect() as connection:
            # Check if user_id column exists
            result = connection.execute(text("""
                SELECT column_name FROM information_schema.columns 
                WHERE table_name = 'cards' AND column_name = 'user_id'
            """))
            
            if not result.fetchone():
                logger.info("Adding user_id column...")
                connection.execute(text("""
                    ALTER TABLE cards 
                    ADD COLUMN user_id INTEGER REFERENCES users(id)
                """))
                logger.info("✅ user_id column added")
            else:
                logger.info("user_id column already exists")
            
            # Check if sold column exists
            result = connection.execute(text("""
                SELECT column_name FROM information_schema.columns 
                WHERE table_name = 'cards' AND column_name = 'sold'
            """))
            
            if not result.fetchone():
                logger.info("Adding sold column...")
                connection.execute(text("""
                    ALTER TABLE cards 
                    ADD COLUMN sold BOOLEAN DEFAULT FALSE
                """))
                logger.info("✅ sold column added")
            else:
                logger.info("sold column already exists")
            
            # Check if features column exists
            result = connection.execute(text("""
                SELECT column_name FROM information_schema.columns 
                WHERE table_name = 'cards' AND column_name = 'features'
            """))
            
            if not result.fetchone():
                logger.info("Adding features column...")
                connection.execute(text("""
                    ALTER TABLE cards 
                    ADD COLUMN features JSON DEFAULT '{}'
                """))
                logger.info("✅ features column added")
            else:
                logger.info("features column already exists")
            
            # Check if front_image_url column exists
            result = connection.execute(text("""
                SELECT column_name FROM information_schema.columns 
                WHERE table_name = 'cards' AND column_name = 'front_image_url'
            """))
            
            if not result.fetchone():
                logger.info("Adding front_image_url column...")
                connection.execute(text("""
                    ALTER TABLE cards 
                    ADD COLUMN front_image_url VARCHAR
                """))
                logger.info("✅ front_image_url column added")
            else:
                logger.info("front_image_url column already exists")
            
            # Check if back_image_url column exists
            result = connection.execute(text("""
                SELECT column_name FROM information_schema.columns 
                WHERE table_name = 'cards' AND column_name = 'back_image_url'
            """))
            
            if not result.fetchone():
                logger.info("Adding back_image_url column...")
                connection.execute(text("""
                    ALTER TABLE cards 
                    ADD COLUMN back_image_url VARCHAR
                """))
                logger.info("✅ back_image_url column added")
            else:
                logger.info("back_image_url column already exists")
            
            connection.commit()
            logger.info("✅ All migrations completed successfully!")
            
    except Exception as e:
        logger.error(f"Error during migration: {e}")
        raise

def update_existing_cards():
    """Update existing cards to have a default user_id if they don't have one"""
    try:
        with engine.connect() as connection:
            # Check if there are cards without user_id
            result = connection.execute(text("""
                SELECT COUNT(*) FROM cards WHERE user_id IS NULL
            """))
            
            count = result.fetchone()[0]
            if count > 0:
                logger.info(f"Found {count} cards without user_id, updating...")
                
                # Get the first user (or create one if none exists)
                user_result = connection.execute(text("SELECT id FROM users LIMIT 1"))
                user = user_result.fetchone()
                
                if user:
                    user_id = user[0]
                    connection.execute(text(f"""
                        UPDATE cards 
                        SET user_id = {user_id} 
                        WHERE user_id IS NULL
                    """))
                    logger.info(f"✅ Updated {count} cards with user_id {user_id}")
                else:
                    logger.warning("No users found in database")
            else:
                logger.info("All cards already have user_id")
            
            connection.commit()
            
    except Exception as e:
        logger.error(f"Error updating existing cards: {e}")
        raise

def main():
    """Run the database migration"""
    logger.info("🔄 Starting database migration...")
    print("=" * 60)
    
    try:
        # Check current structure
        current_columns = check_table_structure()
        print(f"Current columns: {', '.join(current_columns)}")
        
        # Add missing columns
        add_missing_columns()
        
        # Update existing cards
        update_existing_cards()
        
        # Verify final structure
        final_columns = check_table_structure()
        print(f"Final columns: {', '.join(final_columns)}")
        
        print("=" * 60)
        logger.info("🎉 Database migration completed successfully!")
        
    except Exception as e:
        logger.error(f"❌ Migration failed: {e}")
        print("=" * 60)
        print("Migration failed. Please check the error messages above.")
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1) 