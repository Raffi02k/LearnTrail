from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app import models, schemas
from app.auth import security, local_jwt, deps
from app.db import get_db

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not user.hashed_password or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = local_jwt.create_access_token(subject=user.email, roles=user.roles)
    
    # We return the user info directly too? The schema has optional user dict
    user_info = {"id": user.id, "email": user.email, "name": user.name, "roles": user.roles}
    
    return {"access_token": access_token, "token_type": "bearer", "user": user_info}

@router.get("/me", response_model=schemas.UserResponse)
async def read_users_me(current_user: models.User = Depends(deps.get_current_active_user), db: Session = Depends(get_db)):
    # Calculate XP
    total_xp = db.query(models.UserExerciseProgress.earned_xp).filter(models.UserExerciseProgress.user_id == current_user.id).all()
    xp_sum = sum([x[0] for x in total_xp]) if total_xp else 0
    
    response = schemas.UserResponse.from_orm(current_user)
    response.xp_total = xp_sum
    return response

# Optional: Register endpoint for local dev
@router.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = security.get_password_hash(user.password)
    new_user = models.User(
        email=user.email, 
        name=user.name, 
        hashed_password=hashed_password, 
        auth_method="local"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
