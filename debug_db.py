import asyncio
from app.db.mongodb import get_database, connect_to_mongo
import pymongo

async def check():
    await connect_to_mongo()
    db = get_database()
    
    print('--- Recent Tickets ---')
    cursor = db.tickets.find().sort('created_at', pymongo.DESCENDING).limit(5)
    async for t in cursor:
        print(f"ID: {t.get('ticket_id')}")
        print(f"Status: '{t.get('status')}'") # Quote to see spaces
        print(f"Agent: '{t.get('assigned_agent')}'")
        print("---")

    print('\n--- Users matching Sonu ---')
    async for u in db.users.find({'name': {'$regex': 'Sonu', '$options': 'i'}}):
        print(f"Name: {u.get('name')}")
        print(f"ID: {u.get('user_id')}")
        print("---")

if __name__ == "__main__":
    asyncio.run(check())
