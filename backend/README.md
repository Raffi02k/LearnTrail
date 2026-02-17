# LearnTrail Backend 🐍

This is the FastAPI backend for LearnTrail, featuring JWT authentication, OIDC integration, and a secure Python execution environment.

## Setup & Development

### 1. Setup Virtual Environment
It is highly recommended to use a virtual environment.
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment Variables
Ensure you have a `.env` file with the necessary secrets and OIDC configuration.

### 4. Seed Database
Create the initial user and courses:
```bash
python -m app.seed
```

### 5. Run Server
```bash
uvicorn app.main:app --reload --port 8000
```
API docs will be available at `http://localhost:8000/docs`.

## Architecture
- **Framework**: FastAPI
- **Database**: SQLite (SQLAlchemy)
- **Auth**: Hybrid (Local JWT + Microsoft OIDC)
- **Security**: Argon2/Bcrypt for passwords, RS256 for OIDC
