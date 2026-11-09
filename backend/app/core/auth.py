from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import validate_Token
from app.database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models import User
security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db:Session = Depends(get_db)
):
    payload = validate_Token(credentials.credentials)

    if payload is None or "sub" not in payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    try:
        user_id = int(payload["sub"])
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=401,
            detail="Invalid token subject"
        )
    statement=select(User).where(
        User.id==user_id
    )
    user=db.execute(statement).scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=401,detail="user dose not exist")
    return {"id": user.id}