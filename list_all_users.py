import asyncio
import os
from dotenv import load_dotenv
from app.db.mongodb import db

# Load env
load_dotenv()

async def list_users():
    print("Connecting to DB...")
    db.connect()
    database = db.db
    
    print("\n--- Registered Users ---")
    async for user in database.users.find():
        email = user.get("email")
        password = user.get("password")
        role = user.get("role")
        print(f"Email: '{email}' | Role: '{role}' | Password: '{password}'")
        
    print("------------------------\n")
    db.close()

if __name__ == "__main__":
    asyncio.run(list_users())
