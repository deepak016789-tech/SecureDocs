from fastapi import FastAPI,Request
from app.routers import user_router
from app.database import engine,Base
from app.middleware import log_request
from fastapi.middleware.cors import CORSMiddleware


app=FastAPI(
    title="secure document  api",
    description="secure file management system in api",
    version="1.0.0"
)
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.middleware("http")(log_request)

app.include_router(user_router)