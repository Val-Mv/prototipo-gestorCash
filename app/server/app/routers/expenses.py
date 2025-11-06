"""
Router para operaciones CRUD de Expenses
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from datetime import datetime

from app.database import get_db
from app.models import Expense as ExpenseModel
from app.schemas import Expense, ExpenseCreate

router = APIRouter()


@router.post("/", response_model=Expense)
def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db)
):
    """Crear un nuevo gasto"""
    db_expense = ExpenseModel(
        id=str(uuid.uuid4()),
        category=expense.category,
        item=expense.item,
        amount=expense.amount,
        description=expense.description,
        attachment_url=expense.attachment_url,
        store_id=expense.store_id,
        register_id=expense.register_id,
        date=expense.date or datetime.now().strftime("%Y-%m-%d"),
        user_id=expense.user_id,
        created_at=datetime.now()
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense


@router.get("/", response_model=List[Expense])
def get_expenses(
    skip: int = 0,
    limit: int = 100,
    store_id: Optional[str] = None,
    category: Optional[str] = None,
    date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Obtener todos los gastos"""
    query = db.query(ExpenseModel)
    
    if store_id:
        query = query.filter(ExpenseModel.store_id == store_id)
    if category:
        query = query.filter(ExpenseModel.category == category)
    if date:
        query = query.filter(ExpenseModel.date == date)
    
    return query.order_by(ExpenseModel.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{expense_id}", response_model=Expense)
def get_expense(expense_id: str, db: Session = Depends(get_db)):
    """Obtener un gasto por ID"""
    expense = db.query(ExpenseModel).filter(
        ExpenseModel.id == expense_id
    ).first()
    
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    return expense


@router.put("/{expense_id}", response_model=Expense)
def update_expense(
    expense_id: str,
    expense: ExpenseCreate,
    db: Session = Depends(get_db)
):
    """Actualizar un gasto"""
    db_expense = db.query(ExpenseModel).filter(
        ExpenseModel.id == expense_id
    ).first()
    
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    for key, value in expense.dict().items():
        setattr(db_expense, key, value)
    
    db.commit()
    db.refresh(db_expense)
    return db_expense


@router.delete("/{expense_id}")
def delete_expense(expense_id: str, db: Session = Depends(get_db)):
    """Eliminar un gasto"""
    expense = db.query(ExpenseModel).filter(
        ExpenseModel.id == expense_id
    ).first()
    
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    db.delete(expense)
    db.commit()
    return {"message": "Expense deleted successfully"}


@router.get("/stats/by-category", response_model=dict)
def get_expenses_by_category(
    store_id: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Obtener estadísticas de gastos agrupados por categoría"""
    query = db.query(ExpenseModel)
    
    if store_id:
        query = query.filter(ExpenseModel.store_id == store_id)
    if date_from:
        query = query.filter(ExpenseModel.date >= date_from)
    if date_to:
        query = query.filter(ExpenseModel.date <= date_to)
    
    expenses = query.all()
    
    stats = {}
    for expense in expenses:
        category = expense.category
        if category not in stats:
            stats[category] = {"count": 0, "total": 0.0}
        stats[category]["count"] += 1
        stats[category]["total"] += expense.amount
    
    return stats

