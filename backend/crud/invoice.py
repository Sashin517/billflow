from sqlalchemy.orm import Session, joinedload
from models.invoice import Invoice, InvoiceItem
from schemas.invoice import InvoiceCreate


def list_invoices(
    db: Session, user_id: int, status_filter: str | None = None
) -> list[Invoice]:
    query = (
        db.query(Invoice)
        .options(joinedload(Invoice.items))
        .filter(Invoice.user_id == user_id)
    )
    if status_filter:
        query = query.filter(Invoice.status == status_filter)
    return query.order_by(Invoice.created_at.desc()).all()


def get_invoice(db: Session, user_id: int, invoice_id: int) -> Invoice | None:
    return (
        db.query(Invoice)
        .options(joinedload(Invoice.items))
        .filter(Invoice.id == invoice_id, Invoice.user_id == user_id)
        .first()
    )


def create_invoice(db: Session, user_id: int, payload: InvoiceCreate) -> Invoice:
    invoice_data = payload.model_dump(exclude={"items"}, mode="json")
    db_invoice = Invoice(**invoice_data, user_id=user_id)

    for item in payload.items:
        db_invoice.items.append(InvoiceItem(**item.model_dump()))

    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice


def update_invoice(
    db: Session, user_id: int, invoice_id: int, payload: InvoiceCreate
) -> Invoice | None:
    db_invoice = get_invoice(db, user_id, invoice_id)
    if not db_invoice:
        return None

    invoice_data = payload.model_dump(exclude={"items"}, mode="json")
    for field, value in invoice_data.items():
        setattr(db_invoice, field, value)

    # Replace line items cleanly (cascade="all, delete-orphan" removes old ones)
    db_invoice.items.clear()
    for item in payload.items:
        db_invoice.items.append(InvoiceItem(**item.model_dump()))

    db.commit()
    db.refresh(db_invoice)
    return db_invoice


def update_invoice_status(
    db: Session, user_id: int, invoice_id: int, new_status: str
) -> Invoice | None:
    db_invoice = get_invoice(db, user_id, invoice_id)
    if not db_invoice:
        return None
    db_invoice.status = new_status
    db.commit()
    db.refresh(db_invoice)
    return db_invoice


def delete_invoice(db: Session, user_id: int, invoice_id: int) -> bool:
    db_invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id, Invoice.user_id == user_id
    ).first()
    if not db_invoice:
        return False
    db.delete(db_invoice)
    db.commit()
    return True