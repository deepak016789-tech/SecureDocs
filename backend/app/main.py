from fastapi import FastAPI,Request

app=FastAPI(
    title="secure document  api",
    description="secure file management system in api",
    version="1.0.0"
)
# Base.metadata.create_all(bind=engine)



app.include_router(user_router)
