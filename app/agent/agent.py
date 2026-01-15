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
from app.db.mongodb import get_database
import traceback

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
                "You are 'SolarAssist', a friendly, polite, and professional AI customer support agent for UTL Solar. "
                "Your goal is to help users resolve issues by retrieving information from the knowledge base or creating support tickets using your available tools. "
                "1. ALWAYS be courteous, patient, and clear in your responses. "
                "2. Use the 'domain_aware_rag' tool to find answers; do not guess or hallucinate. "
                "3. If the user wants to raise a ticket or reports an issue requiring support, use the 'create_ticket_tool'. "
                "4. If sufficient information is found, provide a clean, concise, and helpful answer. "
                "5. If no information is found and the user does not want a ticket, kindly apologize. "
                "6. Maintain a positive tone, even when handling errors or complaints."
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

    async def process_message(self, session_id: str, message: str, domain: str = "customer", model_number: str = None) -> Dict[str, Any]:
        """
        Process a message through the agent.
        """
        module_name = "AgentService.process_message"
        await AsyncLogger.info(f"Processing message for session {session_id} (Domain: {domain})", module_name)
        
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
            # Inject context
            context_str = f"Context: Domain='{domain}'"
            if model_number:
                context_str += f", Model='{model_number}'"
            context_str += "."
            
            # We prepend context to user message so the agent sees it implicitly
            # Alternatively we could use a SystemMessage but ReAct agent structure might just be simpler with one prompt.
            full_input = f"{context_str}\n\nUser Query: {message}"
            
            input_message = {"messages": [HumanMessage(content=full_input)]}
            
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
            print("ERROR in process_message:")
            traceback.print_exc()
            
            error_msg = str(e)
            # Check for LangGraph corrupted state (Missing ToolMessage)
            if "ToolMessage" in error_msg or "tool_calls" in error_msg:
                try:
                    await AsyncLogger.warning("Corrupted session detected. resetting checkpointer.", module_name, metadata={"session_id": session_id})
                    db = get_database()
                    if db:
                        # Clear checkpoints for this thread to reset state
                        await db["agent_checkpoints"].delete_many({"thread_id": session_id})
                        # Also clear writes if using same collection or separate
                        # Assuming same collection for now or separate writes collection? 
                        # Checkpointer says: collection_name="agent_checkpoints" for checkpoints.
                        # Writes might generally follow thread_id too.
                        
                    err_resp = "I encountered a memory error and have reset the session. Please try your request again."
                except Exception as reset_e:
                    print(f"Failed to reset session: {reset_e}")
                    err_resp = "An internal error occurred. Please refresh the page."
            else:
                err_resp = "An internal error occurred while processing your request. Please try again later."
                
            await AsyncLogger.error("Error processing message", module_name, error=e, metadata={"session_id": session_id})
            await chat_repo.save_message(session_id, "assistant", err_resp, {"error": str(e)})
            return {
                "response": err_resp,
                "used_tools": []
            }

# Singleton instance
agent_service = AgentService()
