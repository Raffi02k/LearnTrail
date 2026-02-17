from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .db import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=True)
    auth_method = Column(String, default="local") # local, oidc
    roles = Column(JSON, default=["user"]) # JSON list of roles
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    exercise_progress = relationship("UserExerciseProgress", back_populates="user")
    course_progress = relationship("UserCourseProgress", back_populates="user")

    # Playground
    playgrounds = relationship("Playground", back_populates="user", cascade="all, delete-orphan", order_by="desc(Playground.updated_at)",)

class Playground(Base):
    __tablename__ = "playgrounds"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String, default="New Playground", nullable=False)
    code = Column(Text, default="", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    user = relationship("User", back_populates="playgrounds")


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    level = Column(String, default="Beginner")
    slug = Column(String, unique=True, index=True)

    # Catalog metadata
    language = Column(String, default="Python")
    subject = Column(String, default="General")
    icon = Column(String, default="📘")
    

    modules = relationship("Module", back_populates="course", order_by="Module.order")

class Module(Base):
    __tablename__ = "modules"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    order = Column(Integer, default=0)
    course_id = Column(Integer, ForeignKey("courses.id"))

    course = relationship("Course", back_populates="modules")
    lessons = relationship("Lesson", back_populates="module", order_by="Lesson.order")

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    order = Column(Integer, default=0)
    module_id = Column(Integer, ForeignKey("modules.id"))

    module = relationship("Module", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", order_by="Exercise.order")

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    order = Column(Integer, default=0)
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    
    prompt = Column(Text, nullable=False)
    starter_code = Column(Text, default="")
    solution_code = Column(Text, default="")
    test_code = Column(Text, default="") # Minimal verify script
    xp_reward = Column(Integer, default=10)
    
    lesson = relationship("Lesson", back_populates="exercises")

class UserExerciseProgress(Base):
    __tablename__ = "user_exercise_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    exercise_id = Column(Integer, ForeignKey("exercises.id"))
    
    status = Column(String, default="not_started") # not_started, in_progress, completed
    last_code = Column(Text, nullable=True)
    attempts = Column(Integer, default=0)
    earned_xp = Column(Integer, default=0)
    last_opened_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="exercise_progress")
    exercise = relationship("Exercise")

class UserCourseProgress(Base):
    __tablename__ = "user_course_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    
    percent_complete = Column(Integer, default=0)
    last_activity_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Pointer to where they left off
    current_lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=True)
    
    user = relationship("User", back_populates="course_progress")
    course = relationship("Course")
