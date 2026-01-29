from fastapi import APIRouter, HTTPException, status, Depends
from app.users.models import LoginRequest, RefreshRequest, Token
from app.users.services import get_user_by_email
from app.auth.utils import verify_password, create_access_token, create_refresh_token, decode_token
from app.db.mongodb import get_database

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest):
    user = await get_user_by_email(login_data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    # In a real DB, you'd fetch the user object directly. 
    # Since find_user_by_email returns a UserInDB object (from services.py), we don't need to wrap it again.
    # But wait, we imported UserInDB from models.
    # The user variable is ALREADY an instance of UserInDB.
    user_in_db = user

    if not verify_password(login_data.password, user_in_db.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last_login
    # In a real DB, you would do: user_service.update_last_login(user_in_db.user_id)
    # For now, we'll assume we can update it in the DB or Mock
    # Update last_login
    # Using local import to avoid potential circular dependency issues
    from app.users.services import update_user
    from datetime import datetime, timezone
    try:
        await update_user(user_in_db.user_id, {"last_login": datetime.now(timezone.utc)})
    except Exception as e:
        print(f"Failed to update last_login: {e}")

    access_token = create_access_token(data={"sub": user_in_db.email, "role": user_in_db.role})
    refresh_token = create_refresh_token(data={"sub": user_in_db.email})
    
    # Store refresh token in DB
    db = get_database()
    await db.users.update_one(
        {"email": user_in_db.email},
        {"$set": {"refresh_token": refresh_token}}
    )
    
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@router.post("/refresh", response_model=Token)
async def refresh_token(request: RefreshRequest):
    payload = decode_token(request.refresh_token)
    if not payload:
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    user = await get_user_by_email(email)
    if not user:
         raise HTTPException(status_code=401, detail="User not found")
         
    # Validate stored token
    if user.refresh_token != request.refresh_token:
         raise HTTPException(status_code=401, detail="Refresh token reused or revoked")
         
    # Issue new tokens
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    # Optional: Rotate refresh token? Plan doesn't strictly say rotate, but it's good practice.
    # Requirement: "Refresh token is stored in database", "Logout removes refresh token"
    # I'll re-issue refresh token to be safe and extend session.
    new_refresh_token = create_refresh_token(data={"sub": user.email})
    
    db = get_database()
    await db.users.update_one(
        {"email": user.email},
        {"$set": {"refresh_token": new_refresh_token}}
    )
    
    return {"access_token": access_token, "refresh_token": new_refresh_token, "token_type": "bearer"}

@router.post("/logout")
async def logout(request: RefreshRequest):
    # Requirement: Logout removes refresh token
    # We can also rely on Auth dependency but logout typically just invalidates token.
    # The prompt says POST /auth/logout. It doesn't strictly say it requires auth header, 
    # but usually logout is for a logged in user.
    # However, if I pass refresh token in body (which is stateless), I can find user by that.
    
    payload = decode_token(request.refresh_token)
    if payload:
        email = payload.get("sub")
        if email:
            db = get_database()
            await db.users.update_one(
                {"email": email},
                {"$unset": {"refresh_token": ""}}
            )
            return {"success": True, "message": "Logged out successfully"}
            
    return {"success": False, "message": "Invalid token or already logged out"}
