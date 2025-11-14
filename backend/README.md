# Sports Card Database Backend

A FastAPI backend for managing a collection of sports cards and users. This application enables user registration, authentication, CRUD operations for cards, and supports image uploads for card images. Data is stored in a PostgreSQL database via SQLAlchemy ORM.

---

## Features
- User registration, authentication, and management
- Full CRUD for sports cards
- Card attributes: player, year, brand, set, sport, number, features, images, etc.
- Image upload/handling for front and back card images
- Relationships between users and cards
- Modern Python stack using FastAPI, SQLAlchemy, Pydantic
- CORS enabled for frontend (React, default `http://localhost:3000`)
- API health check endpoint

---

## Technology Stack
- **Framework:** FastAPI
- **ORM:** SQLAlchemy
- **Database:** PostgreSQL
- **Authentication:** Passlib (bcrypt)
- **Validation:** Pydantic
- **Server:** Uvicorn
- **Other:** Python 3.10+

---

## Project Structure

```
backend/
│   README.md
│   requirements.txt
│   migrate_db.py
│   test_db.py
│
├── app/
│   ├── main.py             # FastAPI application
│   ├── config.py           # Configuration (DB, etc.)
│   ├── database.py         # SQLAlchemy DB setup
│   ├── models/             # SQLAlchemy models (User, Card)
│   ├── schemas/            # Pydantic schemas (validation/response)
│   ├── routers/            # (optional: endpoints organization)
│   ├── auth/               # Authentication, password utils
│   ├── utils/              # (optional: utility functions)
│
├── static/
│   └── images/             # Uploaded card images
└── venv/                   # Python virtual environment (optional)
```

---

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Sports Card Database/backend
   ```

2. **Python environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up PostgreSQL database**
   - Create a database named `sports_card_db` with user `postgres` and password specified in `database.py` (edit as needed):
     ```python
     SQLALCHEMY_DATABASE_URL = "postgresql://postgres:<password>@localhost:5432/sports_card_db"
     ```
   - Make sure PostgreSQL is running.

5. **Run the application**
   ```bash
   uvicorn app.main:app --reload
   ```
   - The API will be available at `http://127.0.0.1:8000/`

6. **API docs**
   - Visit `http://127.0.0.1:8000/docs` for Swagger UI and try the endpoints interactively.

---

## API Overview

### **User Endpoints:**
- **Register:** `POST /users/register` — Create a new user
- **Login:** `POST /users/login` — Authenticate a user
- **Get User:** `GET /users/{user_id}` — Get details of a user
- **Delete User:** `DELETE /users/{user_id}` — Remove user and associated cards

### **Card Endpoints:**
- **Create Card:** `POST /cards` — Add a new card (with user_id and card details)
- **Get All Cards:** `GET /cards` — List all cards
- **Get Card:** `GET /cards/{card_id}` — Get details of a specific card
- **Update Card:** `PUT /cards/{card_id}` — Update an existing card
- **Delete Card:** `DELETE /cards/{card_id}` — Delete a card
- **Upload Card Image:** `POST /cards/{card_id}/upload-image` — Attach an image file to a card (front or back)

### **Other Endpoints:**
- **Health:** `GET /health` — Check API health
- **Root:** `GET /` — Basic info

---

## Example: Creating & Fetching a Card

1. **Register a user**
   ```json
   POST /users/register
   {
     "email": "test@example.com",
     "username": "testuser",
     "password": "yourpassword"
   }
   ```

2. **Create a card**
   ```json
   POST /cards
   {
     "user_id": 1,
     "playerName": "LeBron James",
     "year": 2020,
     "brand": "Panini",
     "setName": "Prizm",
     "sport": "Basketball",
     "cardNumber": "123",
     "features": {"rookie": true},
     "condition": "Mint",
     "value": 250.5,
     "sold": false,
     "front_image_url": null,
     "back_image_url": null
   }
   ```

3. **Upload card image**
   Use `/cards/{card_id}/upload-image` with `multipart/form-data` containing `file` and `image_type` (`front` or `back`).

---

## Environment Variables
- Update `app/database.py` or use OS environment variables for DB credentials in production for security.

---
