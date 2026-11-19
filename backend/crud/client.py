from sqlalchemy.orm import Session
from models.client import Client
from schemas.client import ClientCreate, ClientUpdate


def list_clients(db: Session, user_id: int) -> list[Client]:
    return (
        db.query(Client)
        .filter(Client.user_id == user_id)
        .order_by(Client.created_at.desc())
        .all()
    )


def get_client(db: Session, user_id: int, client_id: int) -> Client | None:
    return db.query(Client).filter(
        Client.id == client_id, Client.user_id == user_id
    ).first()


def create_client(db: Session, user_id: int, payload: ClientCreate) -> Client:
    client = Client(**payload.model_dump(), user_id=user_id)
    db.add(client)
    db.commit()
    db.refresh(client)
    return client


def update_client(
    db: Session, user_id: int, client_id: int, payload: ClientUpdate
) -> Client | None:
    client = get_client(db, user_id, client_id)
    if not client:
        return None
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(client, field, value)
    db.commit()
    db.refresh(client)
    return client


def delete_client(db: Session, user_id: int, client_id: int) -> bool:
    client = get_client(db, user_id, client_id)
    if not client:
        return False
    db.delete(client)
    db.commit()
    return True