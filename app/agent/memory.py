from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory

# Global store for session histories
# Note: In a production environment with multiple instances, this should be backed by Redis or Memcached
store = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    """
    Retrieve or create a chat history for a given session ID.
    """
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

def clear_session_history(session_id: str):
    """
    Clear the history for a specific session.
    """
    if session_id in store:
        del store[session_id]
