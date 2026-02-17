# LearnTrail Frontend 🚀

This is the React + Vite + TypeScript frontend for LearnTrail.

## Setup & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Ensure you have a `.env` file with the following variables:
```env
VITE_API_URL=http://localhost:8000
VITE_ENTRA_CLIENT_ID=your_client_id
VITE_ENTRA_TENANT_ID=your_tenant_id
VITE_ENTRA_REDIRECT_URI=http://localhost:5173
```

### 3. Run Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

## Architecture
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS / Lucide Icons
- **Auth**: MSAL (Microsoft Authentication Library) for OIDC + Axios for JWT
- **State**: React Context (AuthContext)
