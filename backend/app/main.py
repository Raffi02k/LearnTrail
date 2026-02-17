from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()
from app.routers import auth, courses, progress, run, playgrounds
from app import models
from app.db import engine

# Create tables on startup (simplest for MVP)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="LearnTrail API", version="1.0.0")

# CORS
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(progress.router)
app.include_router(run.router)
app.include_router(playgrounds.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to LearnTrail API"}
