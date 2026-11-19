from sqlalchemy.orm import Session
from models.user import User


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id, User.is_active == True).first()


def get_or_create_google_user(
    db: Session,
    email: str,
    google_id: str,
    full_name: str | None = None,
    avatar_url: str | None = None,
) -> User:
    user = get_user_by_email(db, email)
    if not user:
        user = User(
            email=email,
            google_id=google_id,
            full_name=full_name,
            avatar_url=avatar_url,
            auth_provider="google",
        )
        db.add(user)
    elif not user.google_id:
        user.google_id = google_id
        user.avatar_url = user.avatar_url or avatar_url

    db.commit()
    db.refresh(user)
    return user