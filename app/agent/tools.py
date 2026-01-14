from typing import Optional, List, Dict
from langchain_core.tools import tool
from app.knowledge_base.retrieval import retrieval_service

@tool
def domain_aware_rag(query: str, domain: str = "customer", sku_id: Optional[str] = None, top_k: int = 3) -> Dict:
    """
    Retrieve domain-specific information from the knowledge base.
    Use this tool to answer user questions based on stored documents.
    
    Args:
        query: The search query.
        domain: The user's domain ("customer" or "employee").
        sku_id: Optional product SKU or model number to filter by.
        top_k: Number of results to return (default 3).
        
    Returns:
        Structured dictionary containing answer context, confidence, and sources.
    """
    results = retrieval_service.search(query, domain, top_k, sku_id)
    
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
            "sku_id": meta.get("sku_id"),
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

# Tool Registry
registry = [domain_aware_rag]
