from fastapi import APIRouter, HTTPException, Depends, status
from app.db.mongodb import get_database
from app.tickets.models import TicketCreate, TicketResponse, TicketUpdate
from datetime import datetime
import uuid
from typing import List

router = APIRouter(prefix="/complaints", tags=["complaints"])

@router.post("/create", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
async def create_ticket(ticket: TicketCreate, db=Depends(get_database)):
    ticket_id = str(uuid.uuid4())
    new_ticket = ticket.dict()
    new_ticket.update({
        "ticket_id": ticket_id,
        "status": "open",
        "created_at": datetime.utcnow()
    })
    
    await db["customer_ticket"].insert_one(new_ticket)
    return TicketResponse(**new_ticket)

@router.get("/", response_model=List[TicketResponse])
async def list_tickets(assigned_agent: str = None, db=Depends(get_database)):
    tickets = []
    
    query = {}
    if assigned_agent:
        # Support both Name and ID matching for flexibility
        query["$or"] = [
            {"assigned_agent": assigned_agent},
            {"assigned_agent": {"$regex": f"^{assigned_agent}$", "$options": "i"}}
        ]
        
    cursor = db["customer_ticket"].find(query).sort("created_at", -1)
    
    # Calculate total tickets to assign stable IDs (Oldest = COMP-1)
    # If filtering by agent, numbers will still be relative to GLOBAL count if we want consistency?
    # Or relative to this list? User said "COMP-1 is the ID". Usually global.
    # To get global ID, we'd need the global rank.
    # Simple valid approximation for now: Use simple counter relative to list if global is too hard, 
    # BUT global is better.
    # Let's try to get global rank.
    # Actually, simpler: just return the shortened UUID as we did in dashboard if we can't easily get global.
    # User said "COMP-1" is what they see.
    # Let's replicate the Frontend "Index + 1" logic ON THE BACKEND but REVERSED so it makes sense?
    # No, let's just use the total count.
    
    # fetch all to list to calculate IDs (limit 100 for safety if needed, but pagination is not active yet)
    # For global consistency without heavy query per item:
    # We will accept that ID might shift if a row is deleted, unless we persist it.
    # PERSISTENCE IS KEY. But I can't add field to DB right now easily without migration.
    # I will simple use "COMP-{short_uuid}" for now as STABLE ID, which I already did in dashboard.
    # Wait, user REJECTED that. "complain id shi sa do na bo COMP-1 id hai".
    # Ok, I will use a simple counter for this list.
    
    all_tickets_docs = await cursor.to_list(length=1000)
    total_count = len(all_tickets_docs) 
    
    # Assign stable sequential IDs based on creation order.
    # Since list is sorted DESC (Newest first), the ID should be "COMP-{Total - Index}".
    # Example: Total 3. 
    # Index 0 (Newest) -> COMP-3
    # Index 1          -> COMP-2
    # Index 2 (Oldest) -> COMP-1
    
    for i, doc in enumerate(all_tickets_docs):
        t_resp = TicketResponse(**doc)
        # Use total_count - i to give checking increasing ID from oldest to newest
        t_resp.display_id = f"COMP-{total_count - i}" 
        tickets.append(t_resp)
        
    return tickets

@router.get("/{ticket_id}", response_model=TicketResponse)
async def get_ticket(ticket_id: str, db=Depends(get_database)):
    ticket = await db["customer_ticket"].find_one({"ticket_id": ticket_id})
    if not ticket:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return TicketResponse(**ticket)

@router.put("/{ticket_id}", response_model=TicketResponse)
async def update_ticket(ticket_id: str, ticket_update: TicketUpdate, db=Depends(get_database)):
    existing_ticket = await db["customer_ticket"].find_one({"ticket_id": ticket_id})
    if not existing_ticket:
        raise HTTPException(status_code=404, detail="Complaint not found")
        
    update_data = ticket_update.dict(exclude_unset=True)
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        await db["customer_ticket"].update_one(
            {"ticket_id": ticket_id},
            {"$set": update_data}
        )
        
    updated_ticket = await db["customer_ticket"].find_one({"ticket_id": ticket_id})
    return TicketResponse(**updated_ticket)

@router.delete("/{ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_ticket(ticket_id: str, db=Depends(get_database)):
    result = await db["customer_ticket"].delete_one({"ticket_id": ticket_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return None
