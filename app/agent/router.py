from fastapi import APIRouter, HTTPException, Depends
from app.agent.types import ChatRequest, ChatResponse
from app.agent.agent import agent_service
from app.core.logger import AsyncLogger

router = APIRouter(
    prefix="/agent",
    tags=["Agent"]
)

from app.db.chat_repo import chat_repo

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Endpoint to interact with the Agentic AI.
    """
    try:
        # Pass to agent service
        result = await agent_service.process_message(
            session_id=request.session_id, 
            message=request.message,
            domain=request.domain,
            model_number=request.model_number
        )        
        return ChatResponse(
            success=True,
            agent_mode="customer", # Static for now as per requirements
            used_tools=result.get("used_tools", []),
            response=result.get("response")
        )
    except Exception as e:
        await AsyncLogger.error("API Endpoint Error", "API.post_chat", error=e, metadata={"session_id": request.session_id})
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/history/{session_id}")
async def get_history(session_id: str, limit: int = 50):
    try:
        messages = await chat_repo.get_history(session_id, limit)
        return {"success": True, "messages": messages}
    except Exception as e:
        await AsyncLogger.error("Error fetching history", "API.get_history", error=e, metadata={"session_id": session_id})
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/all_chats")
async def get_all_chats(limit: int = 20, skip: int = 0):
    try:
        messages = await chat_repo.get_all_chats(limit, skip)
        return {"success": True, "data": messages}
    except Exception as e:
        await AsyncLogger.error("Error fetching all chats", "API.get_all_chats", error=e)
        raise HTTPException(status_code=500, detail="Internal Server Error")
