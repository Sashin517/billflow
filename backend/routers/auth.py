from fastapi import APIRouter, HTTPException, status
from dependencies import DbSession, CurrentUser
from core.security import verify_google_token, create_access_token
from crud import user as user_crud
from schemas.user import GoogleAuthRequest, AuthResponse, UserOut

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/google", response_model=AuthResponse)
def google_login(payload: GoogleAuthRequest, db: DbSession):
    try:
        google_info = verify_google_token(payload.id_token)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google ID token",
        )

    user = user_crud.get_or_create_google_user(
        db=db,
        email=google_info.get("email"),
        google_id=google_info.get("sub"),
        full_name=google_info.get("name"),
        avatar_url=google_info.get("picture"),
    )

    access_token = create_access_token(user.id)
    return AuthResponse(access_token=access_token, user=user)


@router.get("/me", response_model=UserOut)
def get_me(current_user: CurrentUser):
    return current_user