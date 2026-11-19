from typing import List
from fastapi import APIRouter, HTTPException, status
from dependencies import DbSession, CurrentUser
from crud import client as client_crud
from schemas.client import ClientCreate, ClientUpdate, ClientOut

router = APIRouter(prefix="/api/clients", tags=["Clients"])


@router.get("/", response_model=List[ClientOut])
def list_clients(db: DbSession, current_user: CurrentUser):
    return client_crud.list_clients(db, current_user.id)


@router.get("/{client_id}", response_model=ClientOut)
def get_client(client_id: int, db: DbSession, current_user: CurrentUser):
    client = client_crud.get_client(db, current_user.id, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client


@router.post("/", response_model=ClientOut, status_code=status.HTTP_201_CREATED)
def create_client(payload: ClientCreate, db: DbSession, current_user: CurrentUser):
    return client_crud.create_client(db, current_user.id, payload)


@router.put("/{client_id}", response_model=ClientOut)
def update_client(
    client_id: int, payload: ClientUpdate, db: DbSession, current_user: CurrentUser
):
    client = client_crud.update_client(db, current_user.id, client_id, payload)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client


@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(client_id: int, db: DbSession, current_user: CurrentUser):
    deleted = client_crud.delete_client(db, current_user.id, client_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Client not found")