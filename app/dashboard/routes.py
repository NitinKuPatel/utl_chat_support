from fastapi import APIRouter, Depends, HTTPException
from typing import List, Any
from app.dashboard import services
from app.auth.dependencies import get_current_user
from app.users.models import UserInDB

router = APIRouter()

@router.get("/agents", response_model=List[Any])
async def get_agents_dashboard(
    current_user: UserInDB = Depends(get_current_user)
):
    """
    Get aggregated data for the agent dashboard.
    Includes agent details, status, rating, and current active ticket.
    """
    return await services.get_agent_dashboard_data()
