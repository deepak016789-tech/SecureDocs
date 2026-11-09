from app.schemas import UserCreate,UserLogin
from sqlalchemy.orm import Session
from sqlalchemy import select,or_
from fastapi import HTTPException,Form
from app.core import hash_password,verify_password,Create_Token,validate_Token
from sqlalchemy.exc import IntegrityError
from app.models import User

def Reg_user(data:UserCreate,db:Session):

    statement=select(User).where(
        or_(User.username == data.username,
         User.email == data.email
         )
         )
    ex_user=db.execute(statement).scalar_one_or_none()
    if ex_user is not None:
        raise HTTPException(status_code=409,detail="username is already exist")

    hashed_password=hash_password(data.password)

    user = User(
        username = data.username,
        hashed_password=hashed_password,
        email=data.email
    )
    db.add(user)
    try:
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409,detail="username or email id already exist")

    return user


def user_login(data:UserLogin,db:Session):
    statement = select(User).where(
        or_(
            User.username==data.username_or_email,
            User.email==data.username_or_email
            )
    )
    
    user=db.execute(statement).scalar_one_or_none()

    if user is None:
        raise HTTPException(status_code=401,detail="Invalid username/email or password")

    if not verify_password(data.password,user.hashed_password):
        raise HTTPException(status_code=401,detail="Invalid username/email or password")

    token=Create_Token(user.id)
    
    return {
        "message":f"welcome user {user.username}",
        "access_token":token,
        "token_type":"bearer"
        
    }

