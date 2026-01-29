import asyncio
from app.db.mongodb import get_database, connect_to_mongo
from app.users.models import UserInDB
import pymongo

async def check():
    await connect_to_mongo()
    db = get_database()
    
    # 1. Find User 'sonu'
    user_doc = await db.users.find_one({"name": {"$regex": "^sonu$", "$options": "i"}})
    if not user_doc:
        print("User 'sonu' not found!")
        return

    user = UserInDB(**user_doc)
    print(f"User Found: Name='{user.name}', ID='{user.user_id}'")

    # 2. Simulate the Dashboard Query
    query = {
        "$or": [
            {"assigned_agent": user.user_id},
            {"assigned_agent": user.name}
        ],
        "status": {"$regex": "^(open|pending|in[ _]progress)$", "$options": "i"}
    }
    print(f"Running Query: {query}")

    active_ticket_doc = await db.tickets.find_one(
        query,
        sort=[("created_at", pymongo.DESCENDING)]
    )
    
    if active_ticket_doc:
        print(f"MATCH FOUND: Ticket ID='{active_ticket_doc.get('ticket_id')}', Status='{active_ticket_doc.get('status')}', Assigned='{active_ticket_doc.get('assigned_agent')}'")
    else:
        print("NO MATCH FOUND.")
        
        # 3. Debug: Why no match?
        print("\n--- Diagnostic: List all active tickets for 'sonu' (broad search) ---")
        async for t in db.tickets.find({"assigned_agent": {"$regex": "sonu", "$options": "i"}}):
            print(f"Ticket: {t.get('ticket_id')}, Agent: '{t.get('assigned_agent')}', Status: '{t.get('status')}'")

if __name__ == "__main__":
    asyncio.run(check())
