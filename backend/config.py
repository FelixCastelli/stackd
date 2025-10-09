import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    IGDB_CLIENT_ID: str = os.getenv("IGDB_CLIENT_ID", "")
    IGDB_ACCESS_TOKEN: str = os.getenv("IGDB_ACCESS_TOKEN", "")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev_secret_key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")

settings = Settings()