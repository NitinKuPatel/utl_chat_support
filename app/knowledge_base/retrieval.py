import os
import asyncio
from typing import List, Dict, Any, Optional
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

from app.agent.config import AgentConfig
from app.knowledge_base.config import RAGConfig
from app.core.logger import AsyncLogger

class RetrievalService:
    def __init__(self):
        AgentConfig.validate()
        self.embeddings = OpenAIEmbeddings(
            api_key=AgentConfig.OPENAI_API_KEY,
            base_url=AgentConfig.OPENAI_BASE_URL,
            model=RAGConfig.EMBEDDING_MODEL
        )
        self._indexes = {}

    def _get_vector_store(self, domain: str) -> Optional[FAISS]:
        """Load FAISS index for domain if exists."""
        index_path = RAGConfig.get_index_path(domain)
        if not os.path.exists(index_path):
            if not os.path.exists(os.path.join(index_path, "index.faiss")):
                return None
        
        if domain not in self._indexes:
             try:
                 self._indexes[domain] = FAISS.load_local(
                     index_path, 
                     self.embeddings, 
                     allow_dangerous_deserialization=True # Trusted local source
                 )
             except Exception as e:
                 # Need to call async logger from sync context? 
                 # _get_vector_store is called synchronously from search which is called synchronously from tool.
                 # This presents a challenge for async logger integration in purely synchronous methods.
                 # Ideally, we should use sync logger fallback or run_until_complete if truly needed,
                 # but since search is likely called in threadpool by tool (or we make tool async), 
                 # let's rely on standard logging for this sync internal helper or just print for now
                 # and let the calling methods log errors.
                 print(f"Error loading FAISS index for {domain}: {e}")
                 return None
                 
        return self._indexes[domain]

    def search(self, query: str, domain: str, top_k: int = 3, sku_id: str = None) -> List[Dict[str, Any]]:
        """
        Perform retrieval.
        Note: This method is synchronous because LangChain tools are often sync. 
        If we want async logging, we either need to make this async (and tool async) 
        or use a fire-and-forget task for logging.
        """
        # Since we are inside an Async Agent but the Tool definition might be sync,
        # let's proceed with caution. 
        # Actually, our Tool 'domain_aware_rag' is defined as a function, likely sync.
        # But FastAPI is async.
        # We can use asyncio.create_task() if there is a running loop.
        
        try:
            vector_store = self._get_vector_store(domain)
            if not vector_store:
                 return []
            
            # Filter kwargs
            filter_dict = {}
            if sku_id:
                filter_dict["sku_id"] = sku_id
                
            try:
                docs_with_score = vector_store.similarity_search_with_score(
                    query, 
                    k=top_k,
                    filter=filter_dict if filter_dict else None
                )
            except Exception as e:
                 # Fallback
                 # Log warning
                 print(f"Search warning for filter {filter_dict}: {e}") # Sync fallback
                 docs_with_score = vector_store.similarity_search_with_score(query, k=top_k)
    
            results = []
            for doc, score in docs_with_score:
                confidence = 1.0 / (1.0 + score) 
                
                results.append({
                    "content": doc.page_content,
                    "metadata": doc.metadata,
                    "confidence": confidence
                })
                
            return results
            
        except Exception as e:
            print(f"Critical error in search: {e}")
            return []

retrieval_service = RetrievalService()
