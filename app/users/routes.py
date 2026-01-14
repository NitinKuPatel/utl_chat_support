from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from app.users.models import UserCreate, UserResponse, UserUpdate, UserInDB
from app.users import services
from app.auth.dependencies import get_current_super_admin

router = APIRouter()

@router.post("/", response_model=UserResponse)
async def create_user(
    user: UserCreate, 
    admin: UserInDB = Depends(get_current_super_admin)
):
    # Requirement: Only super_admin can create users (enforced by dependency)
    return await services.create_user(user, created_by_role=admin.role)

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str, 
    admin: UserInDB = Depends(get_current_super_admin)
):
    user = await services.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str, 
    user_update: UserUpdate, 
    admin: UserInDB = Depends(get_current_super_admin)
):
    return await services.update_user(user_id, user_update)

@router.delete("/{user_id}")
async def delete_user(
    user_id: str, 
    admin: UserInDB = Depends(get_current_super_admin)
):
    await services.delete_user(user_id)
    return {"success": True, "message": "User deleted successfully"}

@router.get("/", response_model=List[UserResponse])
async def list_users(
    skip: int = 0,
    limit: int = 10,
    search: Optional[str] = None,
    role: Optional[str] = None,
    department: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    admin: UserInDB = Depends(get_current_super_admin)
):
    return await services.list_users(
        skip=skip, 
        limit=limit, 
        search=search, 
        role=role, 
        department=department,
        sort_by=sort_by,
        sort_order=sort_order
    )
