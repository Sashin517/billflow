import os
import shutil
import uuid
from typing import List
from fastapi import APIRouter, File, HTTPException, UploadFile, status
from dependencies import DbSession, CurrentUser
from crud import settings as settings_crud
from schemas.settings import (
    ProfileUpsert,
    ProfileOut,
    ThemeUpsert,
    ThemeOut,
    TaxOrChargeCreate,
    TaxOrChargeOut,
)

router = APIRouter(prefix="/api/settings", tags=["Settings"])

ALLOWED_LOGO_TYPES = {"image/png", "image/jpeg", "image/webp", "image/svg+xml"}
LOGO_DIR = "uploads/logos"


# --- Business Profile ---
@router.get("/profile", response_model=ProfileOut | None)
def get_profile(db: DbSession, current_user: CurrentUser):
    return settings_crud.get_profile(db, current_user.id)


@router.put("/profile", response_model=ProfileOut)
def upsert_profile(payload: ProfileUpsert, db: DbSession, current_user: CurrentUser):
    return settings_crud.upsert_profile(db, current_user.id, payload)


# --- Theme & Logo Upload ---
@router.get("/theme", response_model=ThemeOut | None)
def get_theme(db: DbSession, current_user: CurrentUser):
    return settings_crud.get_theme(db, current_user.id)


@router.put("/theme", response_model=ThemeOut)
def upsert_theme(payload: ThemeUpsert, db: DbSession, current_user: CurrentUser):
    return settings_crud.upsert_theme(db, current_user.id, payload)


@router.post("/logo", response_model=ThemeOut)
def upload_logo(
    db: DbSession,
    current_user: CurrentUser,
    file: UploadFile = File(...),
):
    if file.content_type not in ALLOWED_LOGO_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported image format")

    os.makedirs(LOGO_DIR, exist_ok=True)
    ext = os.path.splitext(file.filename or "logo.png")[1] or ".png"
    filename = f"user_{current_user.id}_{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(LOGO_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    public_path = f"/uploads/logos/{filename}"
    return settings_crud.update_logo_path(db, current_user.id, public_path)


# --- Taxes ---
@router.get("/taxes", response_model=List[TaxOrChargeOut])
def list_taxes(db: DbSession, current_user: CurrentUser):
    return settings_crud.list_taxes(db, current_user.id)


@router.post("/taxes", response_model=TaxOrChargeOut, status_code=status.HTTP_201_CREATED)
def create_tax(payload: TaxOrChargeCreate, db: DbSession, current_user: CurrentUser):
    return settings_crud.create_tax(db, current_user.id, payload)


@router.delete("/taxes/{tax_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tax(tax_id: int, db: DbSession, current_user: CurrentUser):
    deleted = settings_crud.delete_tax(db, current_user.id, tax_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Tax not found")


# --- Charges ---
@router.get("/charges", response_model=List[TaxOrChargeOut])
def list_charges(db: DbSession, current_user: CurrentUser):
    return settings_crud.list_charges(db, current_user.id)


@router.post("/charges", response_model=TaxOrChargeOut, status_code=status.HTTP_201_CREATED)
def create_charge(payload: TaxOrChargeCreate, db: DbSession, current_user: CurrentUser):
    return settings_crud.create_charge(db, current_user.id, payload)


@router.delete("/charges/{charge_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_charge(charge_id: int, db: DbSession, current_user: CurrentUser):
    deleted = settings_crud.delete_charge(db, current_user.id, charge_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Charge not found")