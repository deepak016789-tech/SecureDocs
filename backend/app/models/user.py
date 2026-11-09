from app.database import Base
from sqlalchemy import String,Integer,ForeignKey
from sqlalchemy.orm import Mapped,mapped_column

class User(Base):
    __tablename__="users"
    id:Mapped[int] = mapped_column(Integer,primary_key=True)
    username:Mapped[str] = mapped_column(String(100),unique=True,nullable=False)
    hashed_password:Mapped[str] = mapped_column(String(200),nullable=False)
    email:Mapped[str] = mapped_column(String(100),nullable=False,unique=True)
