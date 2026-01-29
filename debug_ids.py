import asyncio
from app.db.mongodb import get_database

async def main():
    db = get_database()
    cursor = db.customer_ticket.find({}, {'ticket_id': 1, 'issue_type': 1, '_id': 0})
    tickets = await cursor.to_list(length=20)
    print("--- TICKET IDs ---")
    for t in tickets:
        print(t)

if __name__ == "__main__":
    asyncio.run(main())
