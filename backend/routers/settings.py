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
from utils.r2 import compress_and_upload_logo, delete_logo_from_r2

router = APIRouter(prefix="/api/settings", tags=["Settings"])

ALLOWED_LOGO_TYPES = {"image/png", "image/jpeg", "image/webp"}
MAX_LOGO_BYTES = 5 * 1024 * 1024  # 5 MB


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


@router.post("/theme/logo", response_model=ThemeOut)
async def upload_logo(
    db: DbSession,
    current_user: CurrentUser,
    file: UploadFile = File(...),
):
    if file.content_type not in ALLOWED_LOGO_TYPES:
        raise HTTPException(
            status_code=400, detail="Only PNG, JPG, or WebP images are allowed."
        )

    file_bytes = await file.read()
    if len(file_bytes) > MAX_LOGO_BYTES:
        raise HTTPException(status_code=400, detail="File exceeds 5 MB limit.")

    # Delete previous logo from R2 if one exists
    existing_theme = settings_crud.get_theme(db, current_user.id)
    if existing_theme and existing_theme.logo_path:
        delete_logo_from_r2(existing_theme.logo_path)

    public_url = compress_and_upload_logo(file_bytes, current_user.id)
    return settings_crud.update_logo_path(db, current_user.id, public_url)


@router.delete("/theme/logo", response_model=ThemeOut)
def delete_logo(db: DbSession, current_user: CurrentUser):
    existing_theme = settings_crud.get_theme(db, current_user.id)
    if existing_theme and existing_theme.logo_path:
        delete_logo_from_r2(existing_theme.logo_path)

    return settings_crud.update_logo_path(db, current_user.id, None)


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