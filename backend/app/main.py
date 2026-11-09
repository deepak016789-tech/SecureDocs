from fastapi import FastAPI,Request
from app.routers import user_router
from app.database import engine,Base
from app.middleware import log_request

app=FastAPI(
    title="secure document  api",
    description="secure file management system in api",
    version="1.0.0"
)
Base.metadata.create_all(bind=engine)

app.middleware("http")(log_request)

app.include_router(user_router)