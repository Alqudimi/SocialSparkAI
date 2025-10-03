from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, users, social_accounts, preferences, content, posts
from .config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Social Media Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(social_accounts.router, prefix="/api")
app.include_router(preferences.router, prefix="/api")
app.include_router(content.router, prefix="/api")
app.include_router(posts.router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    pass

@app.get("/")
def read_root():
    return {"message": "Smart Social Media Assistant API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
