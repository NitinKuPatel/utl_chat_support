import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = os.getenv("APP_NAME", "central-user-service")
    APP_ENV: str = os.getenv("APP_ENV", "dev")
    
    MONGODB_URI: str = os.getenv("MONGODB_URI")
    MONGODB_DATABASE: str = os.getenv("MONGODB_DATABASE")
    
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))
    
    # Super Admin Defaults
    DEFAULT_SUPERADMIN_NAME: str = os.getenv("DEFAULT_SUPERADMIN_NAME")
    DEFAULT_SUPERADMIN_EMAIL: str = os.getenv("DEFAULT_SUPERADMIN_EMAIL")
    DEFAULT_SUPERADMIN_MOBILE: str = os.getenv("DEFAULT_SUPERADMIN_MOBILE")
    DEFAULT_SUPERADMIN_PASSWORD: str = os.getenv("DEFAULT_SUPERADMIN_PASSWORD")
    DEFAULT_SUPERADMIN_DEPARTMENT: str = os.getenv("DEFAULT_SUPERADMIN_DEPARTMENT")

    def validate(self):
        missing = []
        required_vars = [
            "MONGODB_URI", "MONGODB_DATABASE", "JWT_SECRET_KEY",
            "DEFAULT_SUPERADMIN_NAME", "DEFAULT_SUPERADMIN_EMAIL",
            "DEFAULT_SUPERADMIN_MOBILE", "DEFAULT_SUPERADMIN_PASSWORD",
            "DEFAULT_SUPERADMIN_DEPARTMENT"
        ]
        for var in required_vars:
            if not getattr(self, var):
                missing.append(var)
        
        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")

settings = Settings()
settings.validate()
