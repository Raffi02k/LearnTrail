from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.db import get_db
from app.auth.deps import get_current_user

router = APIRouter(prefix="/courses", tags=["courses"])

@router.get("/", response_model=List[schemas.CourseList])
def get_courses(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    courses = db.query(models.Course).all()
    # Enrich with progress
    results = []
    for c in courses:
        # Basic progress calculation logic
        # Count total exercises
        # Count completed exercises for this user
        
        # This is a bit inefficient for lists, but fine for MVP SQLite
        total_exercises = 0
        for m in c.modules:
            for l in m.lessons:
                total_exercises += len(l.exercises)
        
        completed_exercises = 0
        user_progress_list = db.query(models.UserExerciseProgress).filter(
            models.UserExerciseProgress.user_id == current_user.id,
            models.UserExerciseProgress.status == "completed"
        ).all()
        completed_ids = {up.exercise_id for up in user_progress_list}
        
        for m in c.modules:
            for l in m.lessons:
                for e in l.exercises:
                    if e.id in completed_ids:
                        completed_exercises += 1
                        
        percent = int((completed_exercises / total_exercises * 100)) if total_exercises > 0 else 0
        
        c_schema = schemas.CourseList.from_orm(c)
        c_schema.total_lessons = total_exercises # using exercise count as proxy for depth
        c_schema.completed_lessons = completed_exercises
        c_schema.percent = percent
        results.append(c_schema)

    return results

@router.get("/{slug}", response_model=schemas.Course)
def get_course_detail(slug: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    course = db.query(models.Course).filter(models.Course.slug == slug).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
            
    # Get all completed exercises for this user
    completed_ex_ids = db.query(models.UserExerciseProgress.exercise_id).filter(
        models.UserExerciseProgress.user_id == current_user.id,
        models.UserExerciseProgress.status == "completed"
    ).all()
    completed_ids_set = {r[0] for r in completed_ex_ids}
    
    # This modifies the object in memory before serialization
    for module in course.modules:
        for lesson in module.lessons:
            # Lesson is complete if all exercises are complete
            if not lesson.exercises:
                lesson.is_completed = False
                continue

            # 1) completion per exercise
            for exercise in lesson.exercises:
                exercise.is_completed = (exercise.id in completed_ids_set)

            # 2) sequential locking per lesson
            # rule:
            # - first exercise unlocked
            # - exercise N locked if exercise N-1 not completed
            previous_exercise_completed = True # so first becomes unlocked
            for i, exercise in enumerate(lesson.exercises):
                if i == 0:
                    exercise.is_locked = False
                else:
                    exercise.is_locked = not previous_exercise_completed
                    previous_exercise_completed = exercise.is_completed    
                    
            # 3) lesson completed if all exercises completed
            lesson.is_completed = all(ex.is_completed for ex in lesson.exercises)
    return course

@router.get("/lesson/{lesson_id}", response_model=schemas.Lesson)
def get_lesson(lesson_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson
