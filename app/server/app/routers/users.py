"""
Router para operaciones CRUD de Users
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.database import get_db
from app.models import User as UserModel
from app.schemas import User, UserCreate

router = APIRouter()


@router.post("/", response_model=User)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    """Crear un nuevo usuario"""
    # Verificar si el email ya existe
    existing_user = db.query(UserModel).filter(
        UserModel.email == user.email
    ).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_user = UserModel(
        uid=user.uid,
        email=user.email,
        display_name=user.display_name,
        role=user.role,
        store_id=user.store_id,
        active=user.active
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.get("/", response_model=List[User])
def get_users(
    skip: int = 0,
    limit: int = 100,
    role: str = None,
    store_id: str = None,
    db: Session = Depends(get_db)
):
    """Obtener todos los usuarios"""
    query = db.query(UserModel)
    
    if role:
        query = query.filter(UserModel.role == role)
    if store_id:
        query = query.filter(UserModel.store_id == store_id)
    
    return query.filter(UserModel.active == True).offset(skip).limit(limit).all()


@router.get("/{user_id}", response_model=User)
def get_user(user_id: str, db: Session = Depends(get_db)):
    """Obtener un usuario por ID"""
    user = db.query(UserModel).filter(
        UserModel.uid == user_id
    ).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user


@router.put("/{user_id}", response_model=User)
def update_user(
    user_id: str,
    user_update: User,
    db: Session = Depends(get_db)
):
    """Actualizar un usuario"""
    db_user = db.query(UserModel).filter(
        UserModel.uid == user_id
    ).first()
    
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    for key, value in user_update.dict(exclude={"uid"}).items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user


@router.delete("/{user_id}")
def delete_user(user_id: str, db: Session = Depends(get_db)):
    """Eliminar (desactivar) un usuario"""
    user = db.query(UserModel).filter(
        UserModel.uid == user_id
    ).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.active = False
    db.commit()
    return {"message": "User deactivated successfully"}

