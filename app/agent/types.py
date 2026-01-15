from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    session_id: str
    message: str
    domain: str = "customer"
    model_number: Optional[str] = None

class ChatResponse(BaseModel):
    success: bool
    agent_mode: str = "customer" # Default to customer for now, logic can change later
    used_tools: List[str] = []
    response: str
