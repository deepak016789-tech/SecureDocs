import os
from sqlalchemy import create_engine
from sqlalchemy.orm import Session,sessionmaker,DeclarativeBase
from dotenv import load_dotenv


load_dotenv()

DATABASE_URL=os.getenv("DATABASE_URL")

if DATABASE_URL is None:
    raise ValueError("missing DATABASE_URL in env file")

class Base(DeclarativeBase):
    pass

engine=create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=1800,
    pool_size=5,
    max_overflow=10,
    pool_timeout=30,
    echo=False
)
SessionLocal=sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)



def get_db()->Session:
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()