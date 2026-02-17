from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models, schemas
from app.db import get_db
from app.auth.deps import get_current_user

router = APIRouter(prefix="/playgrounds", tags=["Playgrounds"])

@router.get("", response_model=list[schemas.PlaygroundResponse])
def list_playgrounds(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.Playground)
        .filter(models.Playground.user_id == current_user.id)
        .order_by(models.Playground.updated_at.desc())
        .all()
    )


@router.post("", response_model=schemas.PlaygroundResponse, status_code=status.HTTP_201_CREATED)
def create_playground(
    payload: schemas.PlaygroundCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    playground = models.Playground(
        user_id=current_user.id,
        title=payload.title or "New Playground",
        code=payload.code or ""
    )

    db.add(playground)
    db.commit()
    db.refresh(playground)

    return playground


@router.get("/{playground_id}", response_model=schemas.PlaygroundResponse)
def get_playground(
    playground_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    playground = (
        db.query(models.Playground)
        .filter(models.Playground.id == playground_id, models.Playground.user_id == current_user.id)
        .first()
    )
    if not playground:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Playground not found")

    return playground


@router.patch("/{playground_id}", response_model=schemas.PlaygroundResponse)
def update_playground(
    playground_id: int,
    payload: schemas.PlaygroundUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    playground = (  
        db.query(models.Playground)
        .filter(models.Playground.id == playground_id, models.Playground.user_id == current_user.id)
        .first()
    )
    if not playground:
        raise HTTPException(status_code=404, detail="Playground not found")

    if payload.title is not None:
        playground.title = payload.title
    if payload.code is not None:
        playground.code = payload.code

    db.commit()
    db.refresh(playground)
    return playground

@router.delete("/{playground_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_playground(
    playground_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    playground = (
        db.query(models.Playground)
        .filter(models.Playground.id == playground_id, models.Playground.user_id == current_user.id)
        .first()
    )
    if not playground:
        raise HTTPException(status_code=404, detail="Playground not found")

    db.delete(playground)
    db.commit()
    return None