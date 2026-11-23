from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any, Dict
from datetime import datetime

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: Optional[Dict[str, Any]] = None

class TokenData(BaseModel):
    email: str | None = None
    roles: List[str] = []

class UserCreate(BaseModel):
    email: EmailStr
    name: str | None = None
    password: str

class AddXpRequest(BaseModel):
    xp: int

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str | None
    auth_method: str
    roles: List[str]
    quiz_xp: Optional[int] = 0
    xp_total: Optional[int] = 0

    class Config:
        from_attributes = True

# Content Schemas
class ExerciseBase(BaseModel):
    title: str
    prompt: str
    starter_code: str
    xp_reward: int

class Exercise(ExerciseBase):
    id: int
    order: int

    is_completed: bool = False
    is_locked: bool = False
    
    class Config:
        from_attributes = True

class ExerciseDetail(Exercise):
    solution_code: Optional[str] = None # Only show if needed or admin

class LessonBase(BaseModel):
    title: str

class Lesson(LessonBase):
    id: int
    order: int
    exercises: List[Exercise] = []
    is_completed: bool = False # Computable field

    class Config:
        from_attributes = True

class ModuleBase(BaseModel):
    title: str

class Module(ModuleBase):
    id: int
    order: int
    lessons: List[Lesson] = []

    class Config:
        from_attributes = True

class CourseBase(BaseModel):
    title: str
    description: str | None = None
    level: str

class Course(CourseBase):
    id: int
    slug: str
    modules: List[Module] = []

    # Catalog metadata
    language: str
    subject: str
    icon: str

    class Config:
        from_attributes = True

class CourseList(CourseBase):
    id: int
    slug: str
    total_lessons: int = 0
    completed_lessons: int = 0
    percent: int = 0

    class Config:
        from_attributes = True

# Run/Execution Schemas
class RunRequest(BaseModel):
    code: str
    exercise_id: Optional[int] = None

class RunResponse(BaseModel):
    output: str
    error: str | None = None
    passed: bool = False
    details: str | None = None

# Playground Schemas
class PlaygroundCreate(BaseModel):
    title: str | None = "New Playground"
    code: str | None = ""

class PlaygroundUpdate(BaseModel):
    title: str | None = None
    code: str | None = None

class PlaygroundResponse(BaseModel):
    id: int
    user_id: int
    title: str
    code: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Progress Schemas
class ProgressUpdate(BaseModel):
    status: str # not_started, in_progress, completed
    code: str
    completed: bool = False
