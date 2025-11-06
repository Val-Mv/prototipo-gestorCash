"""
Modelos de base de datos SQLAlchemy
"""

from sqlalchemy import Column, String, Integer, Float, DateTime, Text, Boolean
from sqlalchemy.sql import func
from app.database import Base


class OpeningCount(Base):
    """Modelo para conteos de apertura"""
    __tablename__ = "opening_counts"

    id = Column(String, primary_key=True, index=True)
    register_id = Column(String, nullable=True)
    store_id = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(String, nullable=False)
    user_name = Column(String, nullable=False)
    date = Column(String, nullable=False)  # YYYY-MM-DD


class ClosingCount(Base):
    """Modelo para conteos de cierre"""
    __tablename__ = "closing_counts"

    id = Column(String, primary_key=True, index=True)
    register_id = Column(String, nullable=True)
    store_id = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    safe_amount = Column(Float, nullable=False)
    sales_cash = Column(Float, nullable=False)
    sales_card = Column(Float, nullable=False)
    customer_count = Column(Integer, nullable=False)
    total_difference = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(String, nullable=False)
    user_name = Column(String, nullable=False)
    date = Column(String, nullable=False)  # YYYY-MM-DD


class Expense(Base):
    """Modelo para gastos operativos"""
    __tablename__ = "expenses"

    id = Column(String, primary_key=True, index=True)
    category = Column(String, nullable=False)  # store_supplies, maintenance, paperwork, transport
    item = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    description = Column(Text, nullable=False)
    attachment_url = Column(String, nullable=True)
    store_id = Column(String, nullable=True)
    register_id = Column(String, nullable=True)
    date = Column(String, nullable=True)  # YYYY-MM-DD
    user_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class DailyReport(Base):
    """Modelo para reportes diarios"""
    __tablename__ = "daily_reports"

    id = Column(String, primary_key=True, index=True)
    store_id = Column(String, nullable=False)
    date = Column(String, nullable=False)  # YYYY-MM-DD
    customers = Column(Integer, nullable=False)
    sales_cash = Column(Float, nullable=False)
    sales_card = Column(Float, nullable=False)
    total_expenses = Column(Float, nullable=False)
    total_difference = Column(Float, nullable=False)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    anomalies = Column(Text, nullable=True)  # JSON string


class User(Base):
    """Modelo para usuarios"""
    __tablename__ = "users"

    uid = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    display_name = Column(String, nullable=True)
    role = Column(String, nullable=False)  # DM, SM, ASM
    store_id = Column(String, nullable=True)
    active = Column(Boolean, default=True)


class Store(Base):
    """Modelo para tiendas"""
    __tablename__ = "stores"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    code = Column(String, nullable=False, unique=True)
    active = Column(Boolean, default=True)


class CashRegister(Base):
    """Modelo para registradoras"""
    __tablename__ = "cash_registers"

    id = Column(String, primary_key=True, index=True)
    store_id = Column(String, nullable=False)
    number = Column(Integer, nullable=False)
    active = Column(Boolean, default=True)

