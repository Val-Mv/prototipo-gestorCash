# GestorCash

Sistema de gestión de efectivo y detección de anomalías para tiendas minoristas.

## 📁 Estructura del Proyecto

```
prototipo-gestorCash/
├── app/
│   ├── server/          # Backend Python (FastAPI)
│   │   ├── app/
│   │   │   ├── routers/ # Routers de la API
│   │   │   ├── models.py
│   │   │   ├── schemas.py
│   │   │   ├── database.py
│   │   │   └── main.py
│   │   ├── requirements.txt
│   │   └── run.py
│   │
│   └── web/              # Frontend Next.js
│       ├── src/
│       │   ├── app/      # Páginas y rutas
│       │   ├── components/
│       │   ├── lib/
│       │   └── hooks/
│       ├── package.json
│       ├── next.config.ts
│       └── tsconfig.json
│
├── docs/                 # Documentación
└── README.md
```

## 🚀 Inicio Rápido

### Backend (Server)

```bash
cd app/server
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python run.py
```

El backend estará en: **http://localhost:8000**

### Frontend (Web)

```bash
cd app/web
npm install
npm run dev
```

El frontend estará en: **http://localhost:3000**

## 📚 Documentación

- **Backend**: Ver `app/server/README.md`
- **Frontend**: Ver documentación en `app/web/`
- **Blueprint**: Ver `docs/blueprint.md`
