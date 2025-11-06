"""
Esquemas Pydantic para validación de datos
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# Opening Counts
class OpeningCountBase(BaseModel):
    register_id: Optional[str] = None
    store_id: str
    amount: float = Field(..., gt=0, description="Monto debe ser mayor a 0")
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$", description="Fecha en formato YYYY-MM-DD")
    user_id: str
    user_name: str


class OpeningCountCreate(OpeningCountBase):
    pass


class OpeningCount(OpeningCountBase):
    id: str
    timestamp: datetime

    class Config:
        from_attributes = True


# Closing Counts
class ClosingCountBase(BaseModel):
    register_id: Optional[str] = None
    store_id: str
    amount: float = Field(..., gt=0)
    safe_amount: float = Field(..., ge=0)
    sales_cash: float = Field(..., ge=0)
    sales_card: float = Field(..., ge=0)
    customer_count: int = Field(..., ge=0)
    total_difference: float
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    user_id: str
    user_name: str


class ClosingCountCreate(ClosingCountBase):
    pass


class ClosingCount(ClosingCountBase):
    id: str
    timestamp: datetime

    class Config:
        from_attributes = True


# Expenses
class ExpenseBase(BaseModel):
    category: str = Field(..., description="store_supplies, maintenance, paperwork, transport")
    item: str = Field(..., min_length=3)
    amount: float = Field(..., gt=0)
    description: str = Field(..., min_length=10)
    attachment_url: Optional[str] = None
    store_id: Optional[str] = None
    register_id: Optional[str] = None
    date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}-\d{2}$")
    user_id: Optional[str] = None


class ExpenseCreate(ExpenseBase):
    pass


class Expense(ExpenseBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


# Daily Reports
class DailyReportBase(BaseModel):
    store_id: str
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    customers: int = Field(..., ge=0)
    sales_cash: float = Field(..., ge=0)
    sales_card: float = Field(..., ge=0)
    total_expenses: float = Field(..., ge=0)
    total_difference: float
    anomalies: Optional[str] = None  # JSON string


class DailyReportCreate(DailyReportBase):
    pass


class DailyReport(DailyReportBase):
    id: str
    generated_at: datetime

    class Config:
        from_attributes = True


# Users
class UserBase(BaseModel):
    email: str = Field(..., description="Email del usuario")
    display_name: Optional[str] = None
    role: str = Field(..., description="DM, SM, o ASM")
    store_id: Optional[str] = None
    active: bool = True


class UserCreate(UserBase):
    uid: str


class User(UserBase):
    uid: str

    class Config:
        from_attributes = True


# Stores
class StoreBase(BaseModel):
    name: str
    code: str
    active: bool = True


class StoreCreate(StoreBase):
    id: str


class Store(StoreBase):
    id: str

    class Config:
        from_attributes = True


# Cash Registers
class CashRegisterBase(BaseModel):
    store_id: str
    number: int = Field(..., gt=0)
    active: bool = True


class CashRegisterCreate(CashRegisterBase):
    id: str


class CashRegister(CashRegisterBase):
    id: str

    class Config:
        from_attributes = True

