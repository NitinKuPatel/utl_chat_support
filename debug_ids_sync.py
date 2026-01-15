from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

def main():
    uri = os.getenv("MONGODB_URI")
    db_name = os.getenv("MONGODB_DATABASE")
    client = MongoClient(uri)
    db = client[db_name]
    
    # Check customer_ticket collection
    print(f"Checking collection: {db.customer_ticket.name}")
    tickets = list(db.customer_ticket.find({}, {'ticket_id': 1, 'issue_type': 1, '_id': 0}).limit(20))
    
    print("--- TICKET IDs ---")
    if not tickets:
        print("No tickets found.")
    for t in tickets:
        print(t)

if __name__ == "__main__":
    main()
