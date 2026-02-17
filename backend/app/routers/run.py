from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.db import get_db
from app.auth.deps import get_current_user
import subprocess
import sys
import tempfile
import os

router = APIRouter(prefix="/learn", tags=["learn"])

def run_python_code_safely(code: str, test_code: str = "") -> dict:
    """
    Writes code to a temp file and runs it via subprocess with timeout.
    This is NOT a fully secure sandbox (docker/nsjail is better), 
    but sufficient for a controlled MVP environment.
    """
    
    # Combine user code with test code if provided
    # Basic testing strategy: Append test assertions after user code
    full_code = code + "\n\n" + test_code
    
    output = ""
    error = ""
    passed = False
    
    try:
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            f.write(full_code)
            temp_path = f.name
            
        # Run with timeout
        # Using sys.executable to ensure we use the same python env (or could specify 'python3')
        process = subprocess.run(
            [sys.executable, temp_path],
            capture_output=True,
            text=True,
            timeout=3 # 3 second timeout
        )
        
        output = process.stdout
        error = process.stderr
        
        if process.returncode == 0:
            passed = True
        else:
            # If error is mainly due to tests failing, we still consider it 'ran' but 'failed tests'
            # But here we just return the raw stderr
            pass
            
        os.unlink(temp_path)
        
    except subprocess.TimeoutExpired:
        error = "Execution timed out (3s limit)."
        passed = False
    except Exception as e:
        error = f"System execution error: {str(e)}"
        passed = False
        
    return {"output": output, "error": error, "passed": passed}

@router.post("/run", response_model=schemas.RunResponse)
def run_code(
    req: schemas.RunRequest, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    test_code = ""
    exercise_id = None
    
    if req.exercise_id:
        exercise = db.query(models.Exercise).filter(models.Exercise.id == req.exercise_id).first()
        if not exercise:
            raise HTTPException(status_code=404, detail="Exercise not found")
        test_code = exercise.test_code
        exercise_id = exercise.id
    
    result = run_python_code_safely(req.code, test_code)
    
    # Auto-save progress ONLY if it's an exercise
    if exercise_id:
        prog = db.query(models.UserExerciseProgress).filter(
            models.UserExerciseProgress.user_id == current_user.id,
            models.UserExerciseProgress.exercise_id == exercise_id
        ).first()
        
        if not prog:
            prog = models.UserExerciseProgress(
                user_id=current_user.id,
                exercise_id=exercise_id,
                status="in_progress",
                last_code=req.code
            )
            db.add(prog)
        else:
            prog.last_code = req.code
        
        if result["passed"]:
             result["details"] = "Tests Passed!"
        
        db.commit()
    
    return schemas.RunResponse(
        output=result["output"], 
        error=result["error"], 
        passed=result["passed"],
        details=result.get("details")
    )
