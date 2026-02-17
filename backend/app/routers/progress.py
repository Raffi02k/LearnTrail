from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app import models, schemas
from app.db import get_db
from app.auth.deps import get_current_user
import datetime

router = APIRouter(prefix="/progress", tags=["progress"])

@router.get("/me")
def get_my_progress(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Get recent progress
    recent = db.query(models.UserExerciseProgress).filter(
        models.UserExerciseProgress.user_id == current_user.id
    ).order_by(models.UserExerciseProgress.last_opened_at.desc()).limit(5).all()
    
    # Flatten for response if needed, or define a schema
    # For now, let's just return raw json or list of IDs and statuses
    return [
        {
            "exercise_id": r.exercise_id, 
            "status": r.status, 
            "last_code": r.last_code, 
            "earned_xp": r.earned_xp
        } 
        for r in recent
    ]

@router.get("/exercise/{exercise_id}")
def get_exercise_progress(exercise_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    prog = db.query(models.UserExerciseProgress).filter(
        models.UserExerciseProgress.user_id == current_user.id,
        models.UserExerciseProgress.exercise_id == exercise_id
    ).first()
    
    if not prog:
        return {"status": "not_started", "code": None}
    
    return {"status": prog.status, "code": prog.last_code, "completed": prog.status == "completed"}

@router.post("/exercise/{exercise_id}")
def update_progress(
    exercise_id: int, 
    update: schemas.ProgressUpdate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    prog = db.query(models.UserExerciseProgress).filter(
        models.UserExerciseProgress.user_id == current_user.id,
        models.UserExerciseProgress.exercise_id == exercise_id
    ).first()
    
    exercise = db.query(models.Exercise).filter(models.Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")

    if not prog:
        prog = models.UserExerciseProgress(
            user_id=current_user.id,
            exercise_id=exercise_id,
            status=update.status,
            last_code=update.code
        )
        db.add(prog)
    else:
        prog.status = update.status
        prog.last_code = update.code
        prog.last_opened_at = datetime.datetime.utcnow()
    
    if update.completed and prog.status != "completed":
        prog.status = "completed"
        prog.completed_at = datetime.datetime.utcnow()
        # Award XP
        prog.earned_xp = exercise.xp_reward
    
    db.commit()
    db.refresh(prog)
    return {"status": "success", "xp_earned": prog.earned_xp}
