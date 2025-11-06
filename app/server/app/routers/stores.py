"""
Router para operaciones CRUD de Stores y Cash Registers
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.database import get_db
from app.models import Store as StoreModel, CashRegister as CashRegisterModel
from app.schemas import Store, StoreCreate, CashRegister, CashRegisterCreate

router = APIRouter()


# Stores
@router.post("/", response_model=Store)
def create_store(
    store: StoreCreate,
    db: Session = Depends(get_db)
):
    """Crear una nueva tienda"""
    db_store = StoreModel(
        id=store.id,
        name=store.name,
        code=store.code,
        active=store.active
    )
    db.add(db_store)
    db.commit()
    db.refresh(db_store)
    return db_store


@router.get("/", response_model=List[Store])
def get_stores(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """Obtener todas las tiendas"""
    query = db.query(StoreModel)
    
    if active_only:
        query = query.filter(StoreModel.active == True)
    
    return query.offset(skip).limit(limit).all()


@router.get("/{store_id}", response_model=Store)
def get_store(store_id: str, db: Session = Depends(get_db)):
    """Obtener una tienda por ID"""
    store = db.query(StoreModel).filter(
        StoreModel.id == store_id
    ).first()
    
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    return store


@router.put("/{store_id}", response_model=Store)
def update_store(
    store_id: str,
    store_update: Store,
    db: Session = Depends(get_db)
):
    """Actualizar una tienda"""
    db_store = db.query(StoreModel).filter(
        StoreModel.id == store_id
    ).first()
    
    if not db_store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    for key, value in store_update.dict(exclude={"id"}).items():
        setattr(db_store, key, value)
    
    db.commit()
    db.refresh(db_store)
    return db_store


@router.delete("/{store_id}")
def delete_store(store_id: str, db: Session = Depends(get_db)):
    """Eliminar (desactivar) una tienda"""
    store = db.query(StoreModel).filter(
        StoreModel.id == store_id
    ).first()
    
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    store.active = False
    db.commit()
    return {"message": "Store deactivated successfully"}


# Cash Registers
@router.post("/registers", response_model=CashRegister)
def create_register(
    register: CashRegisterCreate,
    db: Session = Depends(get_db)
):
    """Crear una nueva registradora"""
    db_register = CashRegisterModel(
        id=register.id,
        store_id=register.store_id,
        number=register.number,
        active=register.active
    )
    db.add(db_register)
    db.commit()
    db.refresh(db_register)
    return db_register


@router.get("/registers", response_model=List[CashRegister])
def get_registers(
    store_id: str = None,
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """Obtener todas las registradoras"""
    query = db.query(CashRegisterModel)
    
    if store_id:
        query = query.filter(CashRegisterModel.store_id == store_id)
    if active_only:
        query = query.filter(CashRegisterModel.active == True)
    
    return query.all()


@router.get("/registers/{register_id}", response_model=CashRegister)
def get_register(register_id: str, db: Session = Depends(get_db)):
    """Obtener una registradora por ID"""
    register = db.query(CashRegisterModel).filter(
        CashRegisterModel.id == register_id
    ).first()
    
    if not register:
        raise HTTPException(status_code=404, detail="Cash register not found")
    
    return register


@router.put("/registers/{register_id}", response_model=CashRegister)
def update_register(
    register_id: str,
    register_update: CashRegister,
    db: Session = Depends(get_db)
):
    """Actualizar una registradora"""
    db_register = db.query(CashRegisterModel).filter(
        CashRegisterModel.id == register_id
    ).first()
    
    if not db_register:
        raise HTTPException(status_code=404, detail="Cash register not found")
    
    for key, value in register_update.dict(exclude={"id"}).items():
        setattr(db_register, key, value)
    
    db.commit()
    db.refresh(db_register)
    return db_register


@router.delete("/registers/{register_id}")
def delete_register(register_id: str, db: Session = Depends(get_db)):
    """Eliminar (desactivar) una registradora"""
    register = db.query(CashRegisterModel).filter(
        CashRegisterModel.id == register_id
    ).first()
    
    if not register:
        raise HTTPException(status_code=404, detail="Cash register not found")
    
    register.active = False
    db.commit()
    return {"message": "Cash register deactivated successfully"}

