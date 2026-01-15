from fastapi import APIRouter, HTTPException, Depends, status
from app.db.mongodb import get_database
from app.tickets.models import TicketCreate, TicketResponse, TicketUpdate
from datetime import datetime
import uuid
from typing import List

router = APIRouter(prefix="/tickets", tags=["tickets"])

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
async def list_tickets(db=Depends(get_database)):
    tickets = []
    cursor = db["customer_ticket"].find()
    async for doc in cursor:
        tickets.append(TicketResponse(**doc))
    return tickets

@router.get("/{ticket_id}", response_model=TicketResponse)
async def get_ticket(ticket_id: str, db=Depends(get_database)):
    ticket = await db["customer_ticket"].find_one({"ticket_id": ticket_id})
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return TicketResponse(**ticket)

@router.put("/{ticket_id}", response_model=TicketResponse)
async def update_ticket(ticket_id: str, ticket_update: TicketUpdate, db=Depends(get_database)):
    existing_ticket = await db["customer_ticket"].find_one({"ticket_id": ticket_id})
    if not existing_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
        
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
        raise HTTPException(status_code=404, detail="Ticket not found")
    return None
