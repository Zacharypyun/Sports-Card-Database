# Sports Card Database

A full-stack application for managing sports card collections with user authentication.

## Features

- User registration and authentication
- Add, view, and delete sports cards
- Card details including player name, year, brand, set, sport, condition, and value
- Image upload support for front and back of cards
- Responsive web interface

## Project Structure

```
Sports Card Database/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── auth/           # Authentication logic
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   └── main.py         # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── test_db.py         # Database test script
└── frontend/               # Next.js frontend
    ├── src/
    │   ├── components/     # React components
    │   └── services/       # API service functions
    └── package.json
```

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Database Setup:**
   - Ensure PostgreSQL is running
   - Create a database named `sports_card_db`
   - Update the database URL in `app/database.py` if needed

5. **Test database connection:**
   ```bash
   python test_db.py
   ```

6. **Start the backend server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and go to:** `http://localhost:3000`

## How to Use

1. **Register a User:**
   - Fill out the registration form with email, username, and password
   - Click "Register User"
   - Note your user ID (you'll need this to create cards)

2. **Add Cards:**
   - After registering, the card creation form will appear
   - Fill in all required fields (marked with *)
   - Click "Add Card"

3. **View and Manage Cards:**
   - All cards are displayed in a grid layout
   - Cards show player name, year, brand, set, sport, condition, and value
   - Sold cards are marked with a "SOLD" badge
   - Delete cards using the delete button

## Troubleshooting

### Common Issues

1. **"User with id X not found" error:**
   - Make sure you've registered a user first
   - Check that the user ID in the database matches what you're using

2. **Database connection errors:**
   - Verify PostgreSQL is running
   - Check database credentials in `app/database.py`
   - Run `python test_db.py` to test connection

3. **Missing dependencies:**
   - Ensure all requirements are installed: `pip install -r requirements.txt`
   - Check for any import errors in the console

4. **Frontend not connecting to backend:**
   - Verify backend is running on port 8000
   - Check CORS settings in `main.py`
   - Ensure API_BASE_URL in `frontend/src/services/api.ts` is correct

### Testing the System

1. **Run the database test:**
   ```bash
   cd backend
   python test_db.py
   ```

2. **Check backend logs:**
   - Look for any error messages when starting the server
   - Check console output for database connection status

3. **Test API endpoints:**
   - Backend health check: `http://localhost:8000/health`
   - API documentation: `http://localhost:8000/docs`

## API Endpoints

- `POST /users/register` - Register a new user
- `POST /cards` - Create a new card
- `GET /cards` - Get all cards
- `GET /cards/{card_id}` - Get a specific card
- `DELETE /cards/{card_id}` - Delete a card
- `POST /cards/{card_id}/upload-image` - Upload card image

## Database Schema

### Users Table
- `id` (Primary Key)
- `email` (Unique)
- `username`
- `password_hash`
- `createdAt`

### Cards Table
- `id` (Primary Key)
- `user_id` (Foreign Key to Users)
- `playerName`
- `year`
- `brand`
- `setName`
- `sport`
- `cardNumber`
- `condition`
- `value`
- `features` (JSON)
- `sold`
- `front_image_url`
- `back_image_url`
- `createdAt`
