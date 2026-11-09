from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func

from app.database import Base


class RequestLog(Base):
    __tablename__ = "request_logs"

    id = Column(Integer, primary_key=True, index=True)

    method = Column(String(10), nullable=False)

    path = Column(String(500), nullable=False)

    status_code = Column(Integer, nullable=False)

    process_time_ms = Column(Float, nullable=False)

    client_ip = Column(String(45), nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )