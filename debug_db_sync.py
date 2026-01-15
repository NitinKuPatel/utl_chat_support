from pymongo import MongoClient

def check():
    client = MongoClient("mongodb://localhost:27017")
    db = client["user_management"]
    
    print('--- Recent Tickets ---')
    cursor = db.tickets.find().sort('created_at', -1).limit(5)
    for t in cursor:
        print(f"ID: {t.get('ticket_id')}")
        print(f"Status: '{t.get('status')}'")
        print(f"Agent: '{t.get('assigned_agent')}'")
        print("---")

    print('\n--- Users matching Sonu ---')
    for u in db.users.find({'name': {'$regex': 'Sonu', '$options': 'i'}}):
        print(f"Name: {u.get('name')}")
        print(f"ID: {u.get('user_id')}")
        print("---")

if __name__ == "__main__":
    check()
