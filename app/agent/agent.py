from typing import List, Dict, Any, Union
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, BaseMessage
from langchain_core.prompts import ChatPromptTemplate
from langgraph.prebuilt import create_react_agent
# from langgraph.checkpoint.memory import MemorySaver (Removed)

from app.agent.config import AgentConfig
from app.agent.tools import registry
from app.core.logger import AsyncLogger
from app.agent.checkpointer import AsyncMongoDBSaver
from app.db.chat_repo import chat_repo

class AgentService:
    def __init__(self):
        self.initialized = False
        try:
            AgentConfig.validate()
        
            self.llm = ChatOpenAI(
                api_key=AgentConfig.OPENAI_API_KEY,
                base_url=AgentConfig.OPENAI_BASE_URL,
                model=AgentConfig.MODEL_NAME,
                temperature=0
            )
            
            self.tools = registry
            
            # System prompt
            system_message = (
                "You are a helpful and intelligent domain-aware agent for a helpdesk system. "
                "You are READ-ONLY and should mostly use the provided tools to answer questions. "
                "You must NOT hallucinate tools or information. "
                "Always be polite and professional."
            )
            
            # Initialize Persistent Checkpointer
            self.checkpointer = AsyncMongoDBSaver()
    
            # Create the agent graph
            self.graph = create_react_agent(
                self.llm, 
                self.tools, 
                prompt=system_message,
                checkpointer=self.checkpointer
            )
            self.initialized = True
            
        except Exception as e:
            # We can't use async logger easily in __init__ (sync), so we print and rely on process_message/startup to log
            print(f"CRITICAL: AgentService initialization failed: {e}")
            # In a real app, this should probably stop startup or retry.
            # self.initialized remains False

    async def process_message(self, session_id: str, message: str) -> Dict[str, Any]:
        """
        Process a message through the agent.
        """
        module_name = "AgentService.process_message"
        await AsyncLogger.info(f"Processing message for session {session_id}", module_name)
        
        # 1. Save User Message
        await chat_repo.save_message(session_id, "user", message)
        
        if not self.initialized:
            await AsyncLogger.error("AgentService not initialized", module_name)
            resp_err = "System is currently unavailable. Please contact support."
            await chat_repo.save_message(session_id, "assistant", resp_err, {"error": "Not Initialized"})
            return {
                "response": resp_err,
                "used_tools": []
            }

        try:
            # LangGraph expects config with thread_id for memory
            config = {"configurable": {"thread_id": session_id}}
            
            # Helper to extracting the final response
            input_message = {"messages": [HumanMessage(content=message)]}
            
            # Invoke the graph
            final_state = await self.graph.ainvoke(input_message, config=config)
            
            messages = final_state.get("messages", [])
            response_text = "I'm sorry, I couldn't generate a response."
            
            if messages:
                last_message = messages[-1]
                if isinstance(last_message, AIMessage):
                    response_text = last_message.content
            
            # Basic analysis of tools used based on message history
            used_tools = []
            for msg in messages:
                if hasattr(msg, "tool_calls") and msg.tool_calls:
                    for tc in msg.tool_calls:
                        used_tools.append(tc.get("name"))
            
            # Deduplicate
            used_tools = list(set(used_tools))

            # Log success
            await AsyncLogger.info(f"Response generated for {session_id}", module_name, metadata={"used_tools": used_tools})

            # 2. Save AI Response
            await chat_repo.save_message(session_id, "assistant", response_text, {"used_tools": used_tools})

            return {
                "response": response_text,
                "used_tools": used_tools
            }
            
        except Exception as e:
            await AsyncLogger.error("Error processing message", module_name, error=e, metadata={"session_id": session_id})
            err_resp = "An internal error occurred while processing your request. Please try again later."
            await chat_repo.save_message(session_id, "assistant", err_resp, {"error": str(e)})
            return {
                "response": err_resp,
                "used_tools": []
            }

# Singleton instance
agent_service = AgentService()
