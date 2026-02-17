# LearnTrail MVP

LearnTrail is a Codecademy-inspired learning platform with Hybrid Authentication (Local + Microsoft Entra ID) and an interactive Python coding environment.

## Architecture

- **Backend**: FastAPI (Python)
  - `auth/`: Handles JWT and OIDC logic.
  - `routers/`: API endpoints for courses, progress, and execution.
  - `db.py`: SQLite with WAL mode.
- **Frontend**: React + Vite + TypeScript
  - `auth/`: MSAL configuration.
  - `context/`: Auth state management.
  - `pages/`: Dashboard, Learning, Login.
  - `components/`: Reusable UI.

## Prerequisites

- Python 3.9+
- Node.js 18+

## Quick Start 🚀

Follow these steps to get the development environment running.

### 1. Backend Setup
The backend uses FastAPI and requires a Python virtual environment.

```bash
cd backend

# Setup virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Seed the database (creates demo user & courses)
python -m app.seed

# Start the server
uvicorn app.main:app --reload --port 8000
```
Backend will be available at: `http://localhost:8000`

### 2. Frontend Setup
The frontend is a React app built with Vite.

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
Frontend will be available at: `http://localhost:5173`

## Authentication Testing

### Local Login (Development)
- **Email**: `test@example.com`
- **Password**: `password123`

### Microsoft Login (OIDC)
To test Microsoft login, you must configure the `.env` files with your Azure AD Tenant ID and Client ID.
1. Create an App Registration in Azure Portal.
2. Add `http://localhost:5173` as a SPA Redirect URI.
3. Update `frontend/.env` and `backend/.env`.

---
## Features

- **Dashboard**: View progress, XP, and streaks.
- **Learning Interface**: 
  - Instructions Panel
  - Monaco Code Editor
  - Output/Console Panel
  - "Run" button executes Python code safely via subprocess.
- **Progress**: Tracks completed exercises and XP.
