from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from database import Base


class SettingsProfile(Base):
    __tablename__ = "settings_profile"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    business_name = Column(String(255), nullable=False)
    street_address = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    state_province = Column(String(100), nullable=True)
    postal_code = Column(String(20), nullable=True)
    country = Column(String(100), nullable=True)
    contact_phones = Column(JSONB, default=list, server_default="[]", nullable=False)
    email = Column(String(255), nullable=True)
    website = Column(String(255), nullable=True)
    tax_number = Column(String(100), nullable=True)
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    user = relationship("User", back_populates="profile")


class SettingsTheme(Base):
    __tablename__ = "settings_theme"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    letterhead_color = Column(String(20), default="#111111", nullable=False)
    logo_path = Column(String(512), nullable=True)
    dark_mode = Column(Boolean, default=True, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    user = relationship("User", back_populates="theme")


class SettingsTax(Base):
    __tablename__ = "settings_taxes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    name = Column(String(100), nullable=False)
    value = Column(Numeric(10, 2), nullable=False)
    value_type = Column(String(20), nullable=False)  # 'percentage' or 'fixed'
    is_default = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="taxes")


class SettingsCharge(Base):
    __tablename__ = "settings_charges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    name = Column(String(100), nullable=False)
    value = Column(Numeric(10, 2), nullable=False)
    value_type = Column(String(20), nullable=False)  # 'percentage' or 'fixed'
    is_default = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="charges")