from sqlalchemy.orm import Session
import models.user_model as user_model
from schemas.user_schema import UserCreate
import auth

def create_user(db: Session, user: UserCreate):
    hashed_password = auth.hash_password(user.password)
    db_user = user_model.User(
        email = user.email,
        username = user.username,
        password = hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session):
    return db.query(user_model.User).all()

def get_user_by_email(db: Session, email: str):
    return db.query(user_model.User).filter(user_model.User.email == email).first()

def authenticate_user(db: Session, email: str, password: str):
    user_obj = get_user_by_email(db, email)
    if not user_obj:
        return None
    if not auth.verify_password(password, user_obj.password):
        return None
    return user_obj