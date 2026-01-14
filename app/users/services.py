from app.db.mongodb import get_database
from app.users.models import UserCreate, UserInDB, UserUpdate
from app.core.config import settings
from app.auth.utils import verify_password
import pymongo
from fastapi import HTTPException
from typing import List, Optional
from datetime import datetime
import re

async def get_user_by_email(email: str):
    db = get_database()
    user = await db.users.find_one({"email": email})
    if user:
        return UserInDB(**user)
    return None

async def get_user_by_id(user_id: str):
    db = get_database()
    user = await db.users.find_one({"user_id": user_id})
    if user:
        return UserInDB(**user)
    return None

async def get_next_sequence_value(department: str):
    db = get_database()
    ret = await db.counters.find_one_and_update(
        {"_id": department},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=pymongo.ReturnDocument.AFTER
    )
    return ret["seq"]

async def create_user(user: UserCreate, created_by_role: str = "super_admin"):
    if created_by_role != "super_admin":
        raise HTTPException(status_code=403, detail="Not authorized to create users")
        
    db = get_database()
    
    if await db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    if await db.users.find_one({"mobile_number": user.mobile_number}):
        raise HTTPException(status_code=400, detail="Mobile number already registered")

    seq = await get_next_sequence_value(user.department.upper())
    user_id = f"{user.department.upper()}-O1C-{seq:03d}"
    
    user_in_db = UserInDB(
        **user.dict(),
        user_id=user_id,
        type="employee",
        status="active",
        created_at=datetime.utcnow()
    )
    
    await db.users.insert_one(user_in_db.dict())
    return user_in_db

async def create_user_direct(user_data: dict):
    db = get_database()
    if await db.users.find_one({"email": user_data["email"]}):
        return None
    await db.users.insert_one(user_data)
    return user_data

async def bootstrap_super_admin():
    db = get_database()
    super_admin = await db.users.find_one({"role": "super_admin"})
    
    if not super_admin:
        user_data = {
            "user_id": "SYSTEM-O1C-001",
            "name": settings.DEFAULT_SUPERADMIN_NAME,
            "email": settings.DEFAULT_SUPERADMIN_EMAIL,
            "mobile_number": settings.DEFAULT_SUPERADMIN_MOBILE,
            "password": settings.DEFAULT_SUPERADMIN_PASSWORD,
            "role": "super_admin",
            "department": settings.DEFAULT_SUPERADMIN_DEPARTMENT,
            "type": "employee",
            "status": "active",
            "created_at": datetime.utcnow()
        }
        await create_user_direct(user_data)
        print("Super admin created successfully")

async def update_user(user_id: str, user_update: UserUpdate):
    db = get_database()
    curr_user = await db.users.find_one({"user_id": user_id})
    if not curr_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    update_data = user_update.dict(exclude_unset=True)
    if not update_data:
        return UserInDB(**curr_user)
        
    if "email" in update_data:
        del update_data["email"] # Email usually not changeable or needs check? PRD says 'Update allowed fields: name, mobile, role, department, status'. Email NOT in allowed list. Good.
        
    update_data["updated_at"] = datetime.utcnow()
    
    await db.users.update_one({"user_id": user_id}, {"$set": update_data})
    
    updated_user = await db.users.find_one({"user_id": user_id})
    return UserInDB(**updated_user)

async def delete_user(user_id: str):
    db = get_database()
    result = await db.users.delete_one({"user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return True

async def list_users(
    skip: int = 0, 
    limit: int = 10, 
    search: Optional[str] = None, 
    role: Optional[str] = None, 
    department: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc"
):
    db = get_database()
    query = {}
    
    if search:
        # Search name, email, mobile
        regex = {"$regex": search, "$options": "i"}
        query["$or"] = [
            {"name": regex},
            {"email": regex},
            {"mobile_number": regex}
        ]
        
    if role:
        query["role"] = role
    
    if department:
        query["department"] = department
        
    sort_dir = pymongo.DESCENDING if sort_order == "desc" else pymongo.ASCENDING
    
    cursor = db.users.find(query).sort(sort_by, sort_dir).skip(skip).limit(limit)
    users = await cursor.to_list(length=limit)
    
    return [UserInDB(**u) for u in users]
