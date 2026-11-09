from fastapi import APIRouter,Depends,Form
from sqlalchemy.orm import Session
from typing import Annotated
from app.database import get_db
from app.schemas import UserCreate,UserResponse,UserLogin
from app.services import Reg_user,user_login
from app.core import get_current_user


router=APIRouter(
    prefix="/auth",
    tags=["auth"] 
)

@router.post("/reg",response_model=UserResponse,status_code=201)
def user_register(data:UserCreate,db:Session=Depends(get_db)):
    return Reg_user(data,db)

@router.post("/login",status_code=200)
def login(data:Annotated[UserLogin,Form()],db:Session=Depends(get_db)):
    return user_login(data,db)