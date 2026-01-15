from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TicketCreate(BaseModel):
    model_name: str = Field(..., description="Name of the product model")
    model_no: Optional[str] = Field(None, description="Model number")
    mobile_no: Optional[str] = Field(None, description="Customer mobile number")
    customer_name: str = Field(..., description="Name of the customer")
    description: str = Field(..., description="Description of the issue")

class TicketUpdate(BaseModel):
    model_name: Optional[str] = None
    model_no: Optional[str] = None
    mobile_no: Optional[str] = None
    customer_name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class TicketResponse(TicketCreate):
    ticket_id: str
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
