from pwdlib import PasswordHash
from pathlib import Path
from datetime import datetime,timedelta,timezone
import os
from dotenv import load_dotenv
import jwt
from jwt.exceptions import InvalidTokenError

load_dotenv()
if os.getenv("KEY_URL") is None:
    raise AttributeError("Key is missing from environment")

if os.getenv("JWT_ALGORITHM") is None:
    raise AttributeError("JWT_ALGORITHM is missing from environment")

KEY_URL=Path(os.getenv("KEY_URL"))

ALGORITHM=os.getenv("JWT_ALGORITHM")

password_hash=PasswordHash.recommended()

def hash_password(password:str)->str:
    return password_hash.hash(password)

def verify_password(plain_password:str,hashed_password:str)->bool:
    return password_hash.verify(plain_password,hashed_password)

def Create_Token(user_id:int)->str:
    path=KEY_URL/"private_key.pem"

    with open(path,"r",encoding="utf-8") as file:
        PRIVATE_KEY=file.read()

    now=datetime.now(timezone.utc)

    payload={
        "sub":str(user_id),
        "iat":now,
        "exp":now+timedelta(minutes=30)
    }

    token=jwt.encode(
        payload,
        PRIVATE_KEY,
        algorithm=ALGORITHM
    )

    return token

def validate_Token(token:str):
    path=KEY_URL/"public_key.pem"

    with open(path,"r",encoding="utf-8") as file:
        PUBLIC_KEY=file.read()

    try:
        payload=jwt.decode(
            token,
            PUBLIC_KEY,
            algorithms=[ALGORITHM]
        )
        return payload

    except InvalidTokenError:
        return None