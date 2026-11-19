from sqlalchemy import Boolean, Column, DateTime, Integer, String, func
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    google_id = Column(String(255), unique=True, index=True, nullable=True)
    full_name = Column(String(255), nullable=True)
    avatar_url = Column(String(512), nullable=True)
    auth_provider = Column(String(50), default="google", nullable=False)
    password_hash = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    profile = relationship(
        "SettingsProfile", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    theme = relationship(
        "SettingsTheme", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    taxes = relationship(
        "SettingsTax", back_populates="user", cascade="all, delete-orphan"
    )
    charges = relationship(
        "SettingsCharge", back_populates="user", cascade="all, delete-orphan"
    )
    clients = relationship(
        "Client", back_populates="user", cascade="all, delete-orphan"
    )
    invoices = relationship(
        "Invoice", back_populates="user", cascade="all, delete-orphan"
    )