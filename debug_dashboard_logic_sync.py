from pymongo import MongoClient
import re

def check():
    client = MongoClient("mongodb://localhost:27017")
    db = client["user_management"]
    
    print("--- Simulating Dashboard Logic (Sync) ---")

    # 1. Find User 'sonu'
    user_doc = db.users.find_one({"name": {"$regex": "^sonu$", "$options": "i"}})
    if not user_doc:
        print("User 'sonu' not found!")
        return

    # Simulate Pydantic model access
    user_id = user_doc.get("user_id")
    user_name = user_doc.get("name")
    print(f"User Found: Name='{user_name}', ID='{user_id}'")

    # 2. Simulate the Dashboard Query
    query = {
        "$or": [
            {"assigned_agent": user_id},
            {"assigned_agent": user_name}
        ],
        "status": {"$regex": "^(open|pending|in[ _]progress)$", "$options": "i"}
    }
    print(f"Running Query: {query}")

    active_ticket_doc = db.tickets.find_one(
        query,
        sort=[("created_at", -1)]
    )
    
    if active_ticket_doc:
        print(f"MATCH FOUND: Ticket ID='{active_ticket_doc.get('ticket_id')}', Status='{active_ticket_doc.get('status')}', Assigned='{active_ticket_doc.get('assigned_agent')}'")
    else:
        print("NO MATCH FOUND.")
        
        # 3. Debug: Why no match?
        print("\n--- Diagnostic: List all active tickets for 'sonu' (broad search) ---")
        cursor = db.tickets.find({"assigned_agent": {"$regex": "sonu", "$options": "i"}})
        for t in cursor:
            print(f"Ticket: {t.get('ticket_id')}, Agent: '{t.get('assigned_agent')}', Status: '{t.get('status')}'")

if __name__ == "__main__":
    check()
