from decimal import Decimal
from typing import List, Literal, Optional
from pydantic import BaseModel, ConfigDict


class ProfileUpsert(BaseModel):
    business_name: str
    street_address: Optional[str] = None
    city: Optional[str] = None
    state_province: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    contact_phones: List[str] = []
    email: Optional[str] = None
    website: Optional[str] = None
    tax_number: Optional[str] = None


class ProfileOut(ProfileUpsert):
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)


class ThemeUpsert(BaseModel):
    letterhead_color: str = "#111111"
    dark_mode: bool = True


class ThemeOut(ThemeUpsert):
    id: int
    logo_path: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class TaxOrChargeCreate(BaseModel):
    name: str
    value: Decimal
    value_type: Literal["percentage", "fixed"]
    is_default: bool = False


class TaxOrChargeOut(TaxOrChargeCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)