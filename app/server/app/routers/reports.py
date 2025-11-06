"""
Router para operaciones CRUD de Reports
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from datetime import datetime

from app.database import get_db
from app.models import DailyReport as DailyReportModel
from app.schemas import DailyReport, DailyReportCreate

router = APIRouter()


@router.post("/", response_model=DailyReport)
def create_report(
    report: DailyReportCreate,
    db: Session = Depends(get_db)
):
    """Crear un nuevo reporte diario"""
    db_report = DailyReportModel(
        id=str(uuid.uuid4()),
        store_id=report.store_id,
        date=report.date,
        customers=report.customers,
        sales_cash=report.sales_cash,
        sales_card=report.sales_card,
        total_expenses=report.total_expenses,
        total_difference=report.total_difference,
        anomalies=report.anomalies,
        generated_at=datetime.now()
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report


@router.get("/", response_model=List[DailyReport])
def get_reports(
    skip: int = 0,
    limit: int = 100,
    store_id: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Obtener todos los reportes diarios"""
    query = db.query(DailyReportModel)
    
    if store_id:
        query = query.filter(DailyReportModel.store_id == store_id)
    if date_from:
        query = query.filter(DailyReportModel.date >= date_from)
    if date_to:
        query = query.filter(DailyReportModel.date <= date_to)
    
    return query.order_by(DailyReportModel.date.desc()).offset(skip).limit(limit).all()


@router.get("/{report_id}", response_model=DailyReport)
def get_report(report_id: str, db: Session = Depends(get_db)):
    """Obtener un reporte por ID"""
    report = db.query(DailyReportModel).filter(
        DailyReportModel.id == report_id
    ).first()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return report


@router.put("/{report_id}", response_model=DailyReport)
def update_report(
    report_id: str,
    report: DailyReportCreate,
    db: Session = Depends(get_db)
):
    """Actualizar un reporte"""
    db_report = db.query(DailyReportModel).filter(
        DailyReportModel.id == report_id
    ).first()
    
    if not db_report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    for key, value in report.dict().items():
        setattr(db_report, key, value)
    
    db.commit()
    db.refresh(db_report)
    return db_report


@router.delete("/{report_id}")
def delete_report(report_id: str, db: Session = Depends(get_db)):
    """Eliminar un reporte"""
    report = db.query(DailyReportModel).filter(
        DailyReportModel.id == report_id
    ).first()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    db.delete(report)
    db.commit()
    return {"message": "Report deleted successfully"}

