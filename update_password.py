import asyncio
from dotenv import load_dotenv
from app.db.mongodb import db

load_dotenv()

async def update_password():
    print("Connecting to DB...")
    db.connect()
    database = db.db
    
    email = "jane@company.com"
    new_password = "utl@123456"
    
    print(f"Updating password for {email} to '{new_password}'...")
    result = await database.users.update_one(
        {"email": email},
        {"$set": {"password": new_password}}
    )
    
    if result.modified_count > 0:
        print("✅ Password updated successfully.")
    else:
        print("❌ User not found or password already set.")
        
    db.close()

if __name__ == "__main__":
    asyncio.run(update_password())
