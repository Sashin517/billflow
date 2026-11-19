from sqlalchemy import (
    Column,
    Date,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from database import Base


class Invoice(Base):
    __tablename__ = "invoices"
    __table_args__ = (
        UniqueConstraint("user_id", "invoice_no", name="uq_user_invoice_no"),
        Index("ix_invoices_user_status", "user_id", "status"),
        Index("ix_invoices_user_issue_date", "user_id", "issue_date"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    client_id = Column(
        Integer, ForeignKey("clients.id", ondelete="RESTRICT"), nullable=False
    )
    invoice_no = Column(String(50), nullable=False)
    issue_date = Column(Date, nullable=False)
    due_date = Column(Date, nullable=True)
    status = Column(String(20), default="Draft", nullable=False)
    subtotal = Column(Numeric(12, 2), nullable=False)
    applied_taxes = Column(JSONB, default=list, server_default="[]", nullable=False)
    tax_total = Column(Numeric(12, 2), default=0.00, nullable=False)
    applied_charges = Column(JSONB, default=list, server_default="[]", nullable=False)
    charge_total = Column(Numeric(12, 2), default=0.00, nullable=False)
    grand_total = Column(Numeric(12, 2), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="invoices")
    client = relationship("Client", back_populates="invoices")
    items = relationship(
        "InvoiceItem", back_populates="invoice", cascade="all, delete-orphan"
    )


class InvoiceItem(Base):
    __tablename__ = "invoice_items"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(
        Integer, ForeignKey("invoices.id", ondelete="CASCADE"), index=True, nullable=False
    )
    item = Column(String(500), nullable=False)
    quantity = Column(Numeric(10, 2), default=1.00, nullable=False)
    rate = Column(Numeric(12, 2), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)

    invoice = relationship("Invoice", back_populates="items")