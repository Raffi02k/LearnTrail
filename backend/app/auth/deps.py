from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.db import get_db
from app import models, schemas
from app.auth import local_jwt, oidc
from jose import JWTError
import os

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Try to decode as local or OIDC
    # We can peek at the header or just try-fail logic
    # Usually OIDC tokens are much longer or have specific headers.
    
    # Let's check if it's a local token first (HS256)
    is_oidc = False
    payload = None
    
    try:
        # Try local decode
        payload = local_jwt.decode_access_token(token)
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        # If local fails, assume it might be OIDC
        is_oidc = True
    
    if is_oidc:
        try:
            # Validate OIDC
            # For this MVP, if OIDC env is not set, we might fail hard
            if not os.getenv("OIDC_JWKS_URL"):
                raise credentials_exception
            
            payload = oidc.validate_oidc_token(token)
            # OIDC often uses 'oid' or 'email' or 'preferred_username'
            username = payload.get("email") or payload.get("preferred_username") or payload.get("sub")
            if not username:
                raise credentials_exception
        except Exception as e:
            import traceback
            traceback.print_exc()
            print(f"OIDC validation failed: {str(e)}")
            raise credentials_exception

    # User is valid, let's find or create them in DB
    user = db.query(models.User).filter(models.User.email == username).first()
    
    if user is None:
        # Auto-provision user if OIDC (or even local if we wanted, but typically local requires registration)
        # For this MVP, if it was a valid OIDC token, we create the user
        if is_oidc:
            name = payload.get("name", "Unknown")
            roles = payload.get("roles", ["user"])
            user = models.User(email=username, name=name, auth_method="oidc", roles=roles)
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
             # If local and user not found (maybe deleted?), fail
             raise credentials_exception

    return user

async def get_current_active_user(current_user: models.User = Depends(get_current_user)):
    return current_user
