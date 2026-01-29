from app.db.mongodb import get_database
from app.users.models import UserInDB
import pymongo
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import random

async def get_agent_dashboard_data() -> List[Dict[str, Any]]:
    db = get_database()
    
    # 1. Fetch all agents
    # Assuming 'agent' role, but also including admins if they take tickets? 
    # For now, let's fetch 'agent' and 'super_admin' to match previous debugging
    # Or just fetch all users and filter in python if needed, but db query is better.
    # Let's target 'agent' specifically as per typical use case, or maybe all employees.
    # Based on previous dummy data, role='agent'.
    # We'll fetch all users for now to be safe and robust.
    users_cursor = db.users.find({"role": {"$in": ["agent", "super_admin", "admin"]}})
    users = await users_cursor.to_list(length=100)
    
    dashboard_data = []
    
    for user_doc in users:
        user = UserInDB(**user_doc)
        
        # 2. Get active ticket (Open or In Progress)
        # Find the ONE most recent active ticket
        # Robust query: Check Name OR ID, and regex status for flexibility
        query = {
            "$or": [
                {"assigned_agent": user.user_id},
                {"assigned_agent": user.name}
            ],
            "status": {"$regex": "^(open|pending|in[ _]progress)$", "$options": "i"}
        }
        
        active_ticket_doc = await db.customer_ticket.find_one(
            query,
            sort=[("created_at", pymongo.DESCENDING)]
        )
        
        active_ticket = None
        if active_ticket_doc:
            # We only need a summary for the dashboard
            raw_id = active_ticket_doc.get("ticket_id", "")
            
            # Calculate sequential ID to match list_tickets logic (Oldest = COMP-1)
            # Count tickets created BEFORE this one
            older_tickets_count = await db.customer_ticket.count_documents({
                "created_at": {"$lt": active_ticket_doc.get("created_at")}
            })
            display_id = f"COMP-{older_tickets_count + 1}"
            
            active_ticket = {
                "id": display_id,
                "ticket_id": raw_id, # Keep full ID for linking
                "subject": active_ticket_doc.get("description", "")[:50] + "..." if len(active_ticket_doc.get("description", "")) > 50 else active_ticket_doc.get("description", ""),
                "issue_type": active_ticket_doc.get("issue_type") or "Support Request",
                "status": active_ticket_doc.get("status"),
                "priority": "Medium",
                "lastUpdate": "Just now"
            }
        
        # 3. Aggregated Stats (Resolved vs Pending)
        total_resolved = await db.customer_ticket.count_documents({
            "$or": [
                {"assigned_agent": user.user_id},
                {"assigned_agent": user.name}
            ],
            "status": {"$regex": "^(resolved|closed)$", "$options": "i"}
        })
        
        total_pending = await db.customer_ticket.count_documents({
             "$or": [
                {"assigned_agent": user.user_id},
                {"assigned_agent": user.name}
            ],
            "status": {"$regex": "^(open|pending|in[ _]progress)$", "$options": "i"}
        })

        # 4. Simulate specific dashboard fields not yet in DB
        # Rating (random 3.5 - 5.0)
        rating = round(random.uniform(3.5, 5.0), 1)
        
        # Status (online/busy/offline)
        # Verify if they have an active ticket -> likely 'busy'
        if active_ticket:
            status = "busy"
        else:
            status = "online" # Default to online for visible agents
            
        agent_data = {
            "id": user.user_id,
            "name": user.name,
            "role": user.role, 
            "email": user.email,
            "avatar_seed": user.name, 
            "status": status,
            "rating": rating,
            "active_ticket": active_ticket,
            "stats": {
                "resolved": total_resolved,
                "pending": total_pending,
                "total": total_resolved + total_pending
            },
            "last_activity": user.last_login or datetime.now(timezone.utc)
        }
        
        dashboard_data.append(agent_data)
        
    return dashboard_data
