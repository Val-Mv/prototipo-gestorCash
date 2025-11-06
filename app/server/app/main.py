"""
Backend API para GestorCash
Sistema de gestión de caja menor y cierres de registradora
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import opening, closing, expenses, reports, users, stores

# Crear tablas en la base de datos
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GestorCash API",
    description="API para gestión de caja menor y cierres de registradora",
    version="1.0.0"
)

# Configurar CORS para permitir conexiones desde Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(opening.router, prefix="/api/opening", tags=["Opening"])
app.include_router(closing.router, prefix="/api/closing", tags=["Closing"])
app.include_router(expenses.router, prefix="/api/expenses", tags=["Expenses"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(stores.router, prefix="/api/stores", tags=["Stores"])


@app.get("/")
async def root():
    return {
        "message": "GestorCash API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

