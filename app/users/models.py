from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime
import re

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None

class UserBase(BaseModel):
    name: str = Field(..., min_length=2)
    email: str # Changed from EmailStr to str to allow .local
    mobile_number: str = Field(..., min_length=10, max_length=15)
    department: str
    role: str

    @validator("email")
    def validate_email(cls, v):
        # Simple regex to allow anything@anything.anything
        if not re.match(r"[^@]+@[^@]+\.[^@]+", v):
            raise ValueError("Invalid email address")
        return v

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserUpdate(BaseModel):
    name: Optional[str] = None
    mobile_number: Optional[str] = None
    role: Optional[str] = None
    department: Optional[str] = None
    status: Optional[str] = None

class UserInDB(UserBase):
    user_id: str
    type: str = "employee"
    status: str = "active"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    
    # Internal fields not always exposed
    password: Optional[str] = None 
    refresh_token: Optional[str] = None

class UserResponse(UserBase):
    user_id: str
    type: str
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True # updated for V2 warning

class LoginRequest(BaseModel):
    email: str
    password: str

class RefreshRequest(BaseModel):
    refresh_token: str
