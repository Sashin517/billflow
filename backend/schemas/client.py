from typing import Optional
from pydantic import BaseModel, ConfigDict


class ClientCreate(BaseModel):
    company_name: str
    contact_person: Optional[str] = None
    position: Optional[str] = None
    email: Optional[str] = None
    contact_number: Optional[str] = None
    street_address: Optional[str] = None
    city: Optional[str] = None
    state_province: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None


class ClientUpdate(ClientCreate):
    company_name: Optional[str] = None


class ClientOut(ClientCreate):
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)