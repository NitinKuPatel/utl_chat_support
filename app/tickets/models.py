from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TicketCreate(BaseModel):
    model_name: str = Field(..., description="Name of the product model")
    model_no: Optional[str] = Field(None, description="Model number")
    mobile_no: Optional[str] = Field(None, description="Customer mobile number")
    customer_name: str = Field(..., description="Name of the customer")
    description: str = Field(..., description="Description of the issue")
    product_category: Optional[str] = Field(None, description="Category of the product")
    issue_type: Optional[str] = Field(None, description="Type of issue reported")
    warranty_status: Optional[str] = Field(None, description="Warranty status of the product")
    assigned_agent: Optional[str] = Field(None, description="ID or Name of the assigned agent")

class TicketUpdate(BaseModel):
    model_name: Optional[str] = None
    model_no: Optional[str] = None
    mobile_no: Optional[str] = None
    customer_name: Optional[str] = None
    description: Optional[str] = None
    product_category: Optional[str] = None
    issue_type: Optional[str] = None
    warranty_status: Optional[str] = None
    assigned_agent: Optional[str] = None
    status: Optional[str] = None

class TicketResponse(TicketCreate):
    ticket_id: str
    display_id: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
