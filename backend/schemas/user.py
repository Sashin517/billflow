from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional


class GoogleAuthRequest(BaseModel):
    id_token: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    auth_provider: str

    model_config = ConfigDict(from_attributes=True)


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut