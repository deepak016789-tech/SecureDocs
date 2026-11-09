from pydantic import BaseModel,field_validator,ConfigDict,EmailStr,TypeAdapter,ValidationError
import re


class UserCreate(BaseModel):
    username:str
    password:str
    email:EmailStr

    @field_validator("password")
    @classmethod
    def validate_password(cls,password:str)->str:
        if len(password) < 8:
            raise ValueError("length is less then 8 char")
        
        if not re.search(r"[A-Z]",password):
            raise ValueError("password is not contain A-Z char")

        if not re.search(r"[a-z]",password):
            raise ValueError("password is not contain a-z char")
        
        if not re.search(r"\d",password):
            raise ValueError("password is not contain 0-9 number")

        if not re.search(r"[^a-zA-Z0-9]",password):
            raise ValueError("password is not contain special symbol")

        return password

class UserResponse(BaseModel):
    id:int 
    username:str
    email:EmailStr

    model_config=ConfigDict(from_attributes=True)

class UserLogin(BaseModel):
    username_or_email:str
    password:str

