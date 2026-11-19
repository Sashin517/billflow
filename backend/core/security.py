from datetime import datetime, timedelta, timezone
import jwt
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from core.config import settings


def create_access_token(user_id: int, expires_minutes: int = 60 * 24 * 7) -> str:
    payload = {
        "sub": str(user_id),
        "exp": datetime.now(timezone.utc) + timedelta(minutes=expires_minutes),
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])


def verify_google_token(token: str) -> dict:
    return id_token.verify_oauth2_token(
        token, google_requests.Request(), settings.GOOGLE_CLIENT_ID
    )