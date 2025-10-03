import os
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    database_url: str = Field(default_factory=lambda: os.getenv("DATABASE_URL", ""))
    secret_key: str = Field(default_factory=lambda: os.getenv("SESSION_SECRET", "your-secret-key-change-in-production"))
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7
    gemini_api_key: str = Field(default_factory=lambda: os.getenv("GEMINI_API_KEY", ""))
    
    class Config:
        env_file = ".env"
        case_sensitive = False

    def validate_config(self):
        if not self.database_url:
            raise ValueError("DATABASE_URL environment variable is required")
        if self.secret_key == "your-secret-key-change-in-production":
            raise ValueError("SESSION_SECRET environment variable should be set for production")

settings = Settings()
