from typing import Optional, List, Dict
from langchain_core.tools import tool
from app.knowledge_base.retrieval import retrieval_service

@tool
def domain_aware_rag(query: str, domain: str = "customer", model_number: Optional[str] = None, top_k: int = 3) -> Dict:
    """
    Retrieve domain-specific information from the knowledge base.
    Use this tool to answer user questions based on stored documents.
    
    Args:
        query: The search query.
        domain: The user's domain ("customer" or "employee").
        model_number: Optional product SKU or model number to filter by.
        top_k: Number of results to return (default 3).
        
    Returns:
        Structured dictionary containing answer context, confidence, and sources.
    """
    results = retrieval_service.search(query, domain, top_k, model_number)
    
    if not results:
        return {
            "answer": "No relevant information found in the knowledge base.",
            "confidence": 0.0,
            "domain_used": domain,
            "sources": []
        }

    # Format sources for tool output
    sources_out = []
    combined_content = ""
    
    max_conf = 0.0
    
    for res in results:
        meta = res["metadata"]
        conf = res["confidence"]
        if conf > max_conf:
            max_conf = conf
            
        combined_content += f"\n---\nSource: {meta.get('file_name', 'unknown')}\nContent: {res['content']}\n"
        
        sources_out.append({
            "file_name": meta.get("file_name"),
            "page_number": meta.get("page_number"),
            "model_number": meta.get("model_number"),
            "doc_type": meta.get("doc_type"),
            "snippet": res["content"][:200] + "..."
        })
        
    # In a pure tool logic, we return the raw info. 
    # The Agent (LLM) will construct the final natural language answer using this return value.
    # The PRD says tool output schema includes 'answer'. 
    # Since this function IS the tool, it should return the data needed for the *Agent* to formulate the answer, 
    # OR we can do a secondary LLM call here if we want the tool to be "agent-like" itself. 
    # The PRD says "This RAG system... is a stateless, deterministic tool callable by agents."
    # AND "Tool output schema: answer (string)..."
    # Usually, RAG tools return chunks. If "answer" is required, the tool itself must generate it.
    # HOWEVER, standard agent flow is: Agent -> Tool(RAG) -> Docs -> Agent -> Final Answer.
    # The prompt says "Answer strictly from retrieved context".
    # I will stick to returning the CONTEXT as the 'answer' field for the Agent to use, 
    # to avoid double-LLM costs/latency, unless strictly interpreted otherwise.
    # But wait, "Context-only answering" is listed under logic.
    # Let's return the Context as the answer payload so the calling Agent generates the final fluent response.
    
    return {
        "answer": combined_content.strip(), # The "answer" for the agent to process
        "confidence": max_conf,
        "domain_used": domain,
        "sources": sources_out
    }

from datetime import datetime
import uuid
from app.db.mongodb import db as app_db

@tool
async def create_ticket_tool(model_name: str, customer_name: str, description: str, model_no: Optional[str] = None, mobile_no: Optional[str] = None) -> Dict:
    """
    Create a new support ticket in the system.
    Use this tool when a user wants to raise a ticket or report an issue.
    
    Args:
        model_name: Name of the product model (Required).
        customer_name: Name of the customer (Required).
        description: Detailed description of the issue (Required).
        model_no: Model number/SKU (Optional).
        mobile_no: Customer's mobile number (Optional).
        
    Returns:
        Dictionary with ticket_id and status.
    """
    if app_db.db is None:
        # Fallback if DB not connected (e.g. testing)
        return {"error": "Database not connected"}

    try:
        ticket_id = str(uuid.uuid4())
        ticket_data = {
            "ticket_id": ticket_id,
            "model_name": model_name,
            "model_no": model_no,
            "mobile_no": mobile_no,
            "customer_name": customer_name,
            "description": description,
            "status": "open",
            "created_at": datetime.utcnow()
        }
        
        await app_db.db["customer_ticket"].insert_one(ticket_data)
        
        return {
            "ticket_id": ticket_id,
            "status": "created",
            "message": f"Ticket created successfully for {customer_name}. Ticket ID: {ticket_id}"
        }
    except Exception as e:
        return {
            "error": str(e),
            "status": "failed",
            "message": "Failed to create ticket due to an internal error."
        }

# Tool Registry
registry = [domain_aware_rag, create_ticket_tool]
