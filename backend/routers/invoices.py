from typing import List, Literal, Optional
from fastapi import APIRouter, HTTPException, Query, status
from dependencies import DbSession, CurrentUser
from crud import invoice as invoice_crud
from crud import client as client_crud
from schemas.invoice import InvoiceCreate, InvoiceOut

router = APIRouter(prefix="/api/invoices", tags=["Invoices"])


@router.get("/", response_model=List[InvoiceOut])
def list_invoices(
    db: DbSession,
    current_user: CurrentUser,
    status_filter: Optional[Literal["Draft", "Pending", "Paid", "Overdue"]] = Query(
        default=None, alias="status"
    ),
):
    return invoice_crud.list_invoices(db, current_user.id, status_filter)


@router.get("/{invoice_id}", response_model=InvoiceOut)
def get_invoice(invoice_id: int, db: DbSession, current_user: CurrentUser):
    invoice = invoice_crud.get_invoice(db, current_user.id, invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice


@router.post("/", response_model=InvoiceOut, status_code=status.HTTP_201_CREATED)
def create_invoice(payload: InvoiceCreate, db: DbSession, current_user: CurrentUser):
    client = client_crud.get_client(db, current_user.id, payload.client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return invoice_crud.create_invoice(db, current_user.id, payload)


@router.put("/{invoice_id}", response_model=InvoiceOut)
def update_invoice(
    invoice_id: int, payload: InvoiceCreate, db: DbSession, current_user: CurrentUser
):
    client = client_crud.get_client(db, current_user.id, payload.client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    invoice = invoice_crud.update_invoice(db, current_user.id, invoice_id, payload)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice


@router.patch("/{invoice_id}/status", response_model=InvoiceOut)
def update_invoice_status(
    invoice_id: int,
    new_status: Literal["Draft", "Pending", "Paid", "Overdue"],
    db: DbSession,
    current_user: CurrentUser,
):
    invoice = invoice_crud.update_invoice_status(
        db, current_user.id, invoice_id, new_status
    )
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice


@router.delete("/{invoice_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_invoice(invoice_id: int, db: DbSession, current_user: CurrentUser):
    deleted = invoice_crud.delete_invoice(db, current_user.id, invoice_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Invoice not found")