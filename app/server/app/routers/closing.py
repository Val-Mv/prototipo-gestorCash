"""
Router para operaciones CRUD de Closing Counts
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime

from app.database import get_db
from app.models import ClosingCount as ClosingCountModel
from app.schemas import ClosingCount, ClosingCountCreate

router = APIRouter()


@router.post("/", response_model=ClosingCount)
def create_closing_count(
    closing_count: ClosingCountCreate,
    db: Session = Depends(get_db)
):
    """Crear un nuevo conteo de cierre"""
    db_closing = ClosingCountModel(
        id=str(uuid.uuid4()),
        register_id=closing_count.register_id,
        store_id=closing_count.store_id,
        amount=closing_count.amount,
        safe_amount=closing_count.safe_amount,
        sales_cash=closing_count.sales_cash,
        sales_card=closing_count.sales_card,
        customer_count=closing_count.customer_count,
        total_difference=closing_count.total_difference,
        date=closing_count.date,
        user_id=closing_count.user_id,
        user_name=closing_count.user_name,
        timestamp=datetime.now()
    )
    db.add(db_closing)
    db.commit()
    db.refresh(db_closing)
    return db_closing


@router.get("/", response_model=List[ClosingCount])
def get_closing_counts(
    skip: int = 0,
    limit: int = 100,
    store_id: str = None,
    date: str = None,
    db: Session = Depends(get_db)
):
    """Obtener todos los conteos de cierre"""
    query = db.query(ClosingCountModel)
    
    if store_id:
        query = query.filter(ClosingCountModel.store_id == store_id)
    if date:
        query = query.filter(ClosingCountModel.date == date)
    
    return query.offset(skip).limit(limit).all()


@router.get("/{closing_id}", response_model=ClosingCount)
def get_closing_count(closing_id: str, db: Session = Depends(get_db)):
    """Obtener un conteo de cierre por ID"""
    closing_count = db.query(ClosingCountModel).filter(
        ClosingCountModel.id == closing_id
    ).first()
    
    if not closing_count:
        raise HTTPException(status_code=404, detail="Closing count not found")
    
    return closing_count


@router.put("/{closing_id}", response_model=ClosingCount)
def update_closing_count(
    closing_id: str,
    closing_count: ClosingCountCreate,
    db: Session = Depends(get_db)
):
    """Actualizar un conteo de cierre"""
    db_closing = db.query(ClosingCountModel).filter(
        ClosingCountModel.id == closing_id
    ).first()
    
    if not db_closing:
        raise HTTPException(status_code=404, detail="Closing count not found")
    
    for key, value in closing_count.dict().items():
        setattr(db_closing, key, value)
    
    db.commit()
    db.refresh(db_closing)
    return db_closing


@router.delete("/{closing_id}")
def delete_closing_count(closing_id: str, db: Session = Depends(get_db)):
    """Eliminar un conteo de cierre"""
    closing_count = db.query(ClosingCountModel).filter(
        ClosingCountModel.id == closing_id
    ).first()
    
    if not closing_count:
        raise HTTPException(status_code=404, detail="Closing count not found")
    
    db.delete(closing_count)
    db.commit()
    return {"message": "Closing count deleted successfully"}

