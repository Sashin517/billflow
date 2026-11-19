from datetime import date
from decimal import Decimal
from typing import List, Literal, Optional
from pydantic import BaseModel, ConfigDict


class AppliedRule(BaseModel):
    name: str
    value: Decimal
    type: Literal["percentage", "fixed"]
    amount: Decimal


class InvoiceItemCreate(BaseModel):
    item: str
    quantity: Decimal = Decimal("1.00")
    rate: Decimal
    amount: Decimal


class InvoiceItemOut(InvoiceItemCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)


class InvoiceCreate(BaseModel):
    client_id: int
    invoice_no: str
    issue_date: date
    due_date: Optional[date] = None
    status: Literal["Draft", "Pending", "Paid", "Overdue"] = "Draft"
    subtotal: Decimal
    applied_taxes: List[AppliedRule] = []
    tax_total: Decimal = Decimal("0.00")
    applied_charges: List[AppliedRule] = []
    charge_total: Decimal = Decimal("0.00")
    grand_total: Decimal
    notes: Optional[str] = None
    items: List[InvoiceItemCreate]


class InvoiceOut(InvoiceCreate):
    id: int
    user_id: int
    items: List[InvoiceItemOut]
    model_config = ConfigDict(from_attributes=True)