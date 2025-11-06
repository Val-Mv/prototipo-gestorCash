"""
Script para ejecutar el servidor de desarrollo
"""

import uvicorn
import sys
import os

# Agregar el directorio actual al path para importar app
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

