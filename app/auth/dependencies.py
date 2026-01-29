from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from app.auth.utils import decode_token
from app.users.services import get_user_by_email
from app.users.models import UserInDB
from typing import Optional

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)

async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserInDB:
    print(f"DEBUG: get_current_user called. Token present: {bool(token)}")
    if not token:
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization Header or Invalid Bearer Token",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        print("DEBUG: Attempting to decode token...")
        payload = decode_token(token)
        print(f"DEBUG: Token decoded successfully. Payload: {payload}")
    except JWTError as e:
        print(f"DEBUG: JWTError caught: {e}")
        # Detailed error for frontend
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except JWTError as e:
        # Detailed error for frontend
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if payload is None:
        raise credentials_exception
        
    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception
        
    user = await get_user_by_email(email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"User not found for email: {email}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

async def get_current_super_admin(current_user: UserInDB = Depends(get_current_user)):
    if current_user.role != "super_admin":
        raise HTTPException(
            status_code=403, 
            detail="The user doesn't have enough privileges"
        )
    return current_user
