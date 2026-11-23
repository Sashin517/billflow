from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,   # Tests connection before using it; auto-reconnects if Neon idled
    pool_recycle=300,     # Recycles connections every 5 minutes
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass