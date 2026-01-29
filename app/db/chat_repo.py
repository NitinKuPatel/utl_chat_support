from datetime import datetime
from typing import List, Dict, Any, Optional
from app.db.mongodb import get_database

class ChatRepository:
    COLLECTION = "chat_history"
    
    @classmethod
    async def save_message(cls, session_id: str, role: str, content: str, metadata: Optional[Dict[str, Any]] = None):
        """
        Save a single message to the chat history.
        """
        doc = {
            "session_id": session_id,
            "role": role,
            "content": content,
            "timestamp": datetime.utcnow(),
            "metadata": metadata or {}
        }
        
        db = get_database()
        if db is not None:
             await db[cls.COLLECTION].insert_one(doc)

    @classmethod
    async def get_history(cls, session_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """
        Get chat history for a specific session.
        """
        db = get_database()
        if db is None:
            return []
            
        cursor = db[cls.COLLECTION].find({"session_id": session_id}).sort("timestamp", 1).limit(limit)
        
        messages = []
        async for doc in cursor:
            # Convert ObjectId to str if needed, but usually for JSON response we just drop it or format it
            doc["_id"] = str(doc["_id"])
            messages.append(doc)
            
        return messages

    @classmethod
    async def get_all_chats(cls, limit: int = 20, skip: int = 0) -> List[Dict[str, Any]]:
        """
        Get all chat sessions (or messages) paginated.
        Grouped by session_id might be better, but user asked for "get all chat".
        Let's return a list of recent messages or sessions. 
        Usually "All Chats" means list of sessions. 
        But here we store flat messages. 
        Let's return distinct session_ids or just recent messages.
        Given requirements, let's return raw messages paginated, sorted by time descending.
        """
        db = get_database()
        if db is None:
            return []
            
        cursor = db[cls.COLLECTION].find({}).sort("timestamp", -1).skip(skip).limit(limit)
        
        messages = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            messages.append(doc)
            
        return messages

chat_repo = ChatRepository()
