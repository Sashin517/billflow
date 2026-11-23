from sqlalchemy.orm import Session
from models.settings import (
    SettingsProfile,
    SettingsTheme,
    SettingsTax,
    SettingsCharge,
)
from schemas.settings import ProfileUpsert, ThemeUpsert, TaxOrChargeCreate


def get_profile(db: Session, user_id: int) -> dict | None:
    profile = db.query(SettingsProfile).filter(
        SettingsProfile.user_id == user_id
    ).first()
    if not profile:
        return None

    taxes = list_taxes(db, user_id)
    charges = list_charges(db, user_id)

    return {
        **profile.__dict__,
        "taxes": taxes,
        "charges": charges,
    }


def upsert_profile(db: Session, user_id: int, payload: ProfileUpsert) -> dict:
    profile_data = payload.model_dump(exclude={"taxes", "charges"})

    profile = db.query(SettingsProfile).filter(
        SettingsProfile.user_id == user_id
    ).first()

    if profile:
        for field, value in profile_data.items():
            setattr(profile, field, value)
    else:
        profile = SettingsProfile(**profile_data, user_id=user_id)
        db.add(profile)

    # Sync taxes in the same transaction
    db.query(SettingsTax).filter(SettingsTax.user_id == user_id).delete()
    db.add_all([
        SettingsTax(**t.model_dump(), user_id=user_id)
        for t in payload.taxes
    ])

    # Sync charges in the same transaction
    db.query(SettingsCharge).filter(SettingsCharge.user_id == user_id).delete()
    db.add_all([
        SettingsCharge(**c.model_dump(), user_id=user_id)
        for c in payload.charges
    ])

    db.commit()
    db.refresh(profile)

    taxes = list_taxes(db, user_id)
    charges = list_charges(db, user_id)

    return {
        **profile.__dict__,
        "taxes": taxes,
        "charges": charges,
    }


def get_theme(db: Session, user_id: int) -> SettingsTheme | None:
    return db.query(SettingsTheme).filter(SettingsTheme.user_id == user_id).first()


def upsert_theme(db: Session, user_id: int, payload: ThemeUpsert) -> SettingsTheme:
    theme = get_theme(db, user_id)
    if theme:
        for field, value in payload.model_dump().items():
            setattr(theme, field, value)
    else:
        theme = SettingsTheme(**payload.model_dump(), user_id=user_id)
        db.add(theme)
    db.commit()
    db.refresh(theme)
    return theme


def update_logo_path(db: Session, user_id: int, public_path: str) -> SettingsTheme:
    theme = get_theme(db, user_id)
    if theme:
        theme.logo_path = public_path
    else:
        theme = SettingsTheme(user_id=user_id, logo_path=public_path)
        db.add(theme)
    db.commit()
    db.refresh(theme)
    return theme


def list_taxes(db: Session, user_id: int) -> list[SettingsTax]:
    return db.query(SettingsTax).filter(SettingsTax.user_id == user_id).all()


def create_tax(db: Session, user_id: int, payload: TaxOrChargeCreate) -> SettingsTax:
    tax = SettingsTax(**payload.model_dump(), user_id=user_id)
    db.add(tax)
    db.commit()
    db.refresh(tax)
    return tax


def delete_tax(db: Session, user_id: int, tax_id: int) -> bool:
    tax = db.query(SettingsTax).filter(
        SettingsTax.id == tax_id, SettingsTax.user_id == user_id
    ).first()
    if not tax:
        return False
    db.delete(tax)
    db.commit()
    return True


def list_charges(db: Session, user_id: int) -> list[SettingsCharge]:
    return db.query(SettingsCharge).filter(SettingsCharge.user_id == user_id).all()


def create_charge(db: Session, user_id: int, payload: TaxOrChargeCreate) -> SettingsCharge:
    charge = SettingsCharge(**payload.model_dump(), user_id=user_id)
    db.add(charge)
    db.commit()
    db.refresh(charge)
    return charge


def delete_charge(db: Session, user_id: int, charge_id: int) -> bool:
    charge = db.query(SettingsCharge).filter(
        SettingsCharge.id == charge_id, SettingsCharge.user_id == user_id
    ).first()
    if not charge:
        return False
    db.delete(charge)
    db.commit()
    return True