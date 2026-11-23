from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from core.config import settings
from database import Base, engine
import models  # noqa: F401 - registers all tables with Base.metadata
from routers import auth, settings as settings_router, clients, invoices

# Create all 8 tables in PostgreSQL if they don't exist
Base.metadata.create_all(bind=engine)

# Initialize app BEFORE registering middleware or routers
app = FastAPI(title="BillFlow API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        settings.FRONTEND_URL,
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Register all routers
app.include_router(auth.router)
app.include_router(settings_router.router)
app.include_router(clients.router)
app.include_router(invoices.router)


@app.get("/health")
def health_check():
    return {"status": "ok", "database": "billflow"}