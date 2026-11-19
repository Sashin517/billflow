from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship
from database import Base


class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    company_name = Column(String(255), nullable=False)
    contact_person = Column(String(255), nullable=True)
    position = Column(String(100), nullable=True)
    email = Column(String(255), nullable=True)
    contact_number = Column(String(50), nullable=True)
    street_address = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    state_province = Column(String(100), nullable=True)
    postal_code = Column(String(20), nullable=True)
    country = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="clients")
    invoices = relationship("Invoice", back_populates="client")