"""
Router para operaciones CRUD de Opening Counts
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime

from app.database import get_db
from app.models import OpeningCount as OpeningCountModel
from app.schemas import OpeningCount, OpeningCountCreate

router = APIRouter()


@router.post("/", response_model=OpeningCount)
def create_opening_count(
    opening_count: OpeningCountCreate,
    db: Session = Depends(get_db)
):
    """Crear un nuevo conteo de apertura"""
    db_opening = OpeningCountModel(
        id=str(uuid.uuid4()),
        register_id=opening_count.register_id,
        store_id=opening_count.store_id,
        amount=opening_count.amount,
        date=opening_count.date,
        user_id=opening_count.user_id,
        user_name=opening_count.user_name,
        timestamp=datetime.now()
    )
    db.add(db_opening)
    db.commit()
    db.refresh(db_opening)
    return db_opening


@router.get("/", response_model=List[OpeningCount])
def get_opening_counts(
    skip: int = 0,
    limit: int = 100,
    store_id: str = None,
    date: str = None,
    db: Session = Depends(get_db)
):
    """Obtener todos los conteos de apertura"""
    query = db.query(OpeningCountModel)
    
    if store_id:
        query = query.filter(OpeningCountModel.store_id == store_id)
    if date:
        query = query.filter(OpeningCountModel.date == date)
    
    return query.offset(skip).limit(limit).all()


@router.get("/{opening_id}", response_model=OpeningCount)
def get_opening_count(opening_id: str, db: Session = Depends(get_db)):
    """Obtener un conteo de apertura por ID"""
    opening_count = db.query(OpeningCountModel).filter(
        OpeningCountModel.id == opening_id
    ).first()
    
    if not opening_count:
        raise HTTPException(status_code=404, detail="Opening count not found")
    
    return opening_count


@router.put("/{opening_id}", response_model=OpeningCount)
def update_opening_count(
    opening_id: str,
    opening_count: OpeningCountCreate,
    db: Session = Depends(get_db)
):
    """Actualizar un conteo de apertura"""
    db_opening = db.query(OpeningCountModel).filter(
        OpeningCountModel.id == opening_id
    ).first()
    
    if not db_opening:
        raise HTTPException(status_code=404, detail="Opening count not found")
    
    for key, value in opening_count.dict().items():
        setattr(db_opening, key, value)
    
    db.commit()
    db.refresh(db_opening)
    return db_opening


@router.delete("/{opening_id}")
def delete_opening_count(opening_id: str, db: Session = Depends(get_db)):
    """Eliminar un conteo de apertura"""
    opening_count = db.query(OpeningCountModel).filter(
        OpeningCountModel.id == opening_id
    ).first()
    
    if not opening_count:
        raise HTTPException(status_code=404, detail="Opening count not found")
    
    db.delete(opening_count)
    db.commit()
    return {"message": "Opening count deleted successfully"}

