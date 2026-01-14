import os
import time
import asyncio
from typing import List
from langchain_core.documents import Document
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, TextLoader, Docx2txtLoader

from app.agent.config import AgentConfig
from app.knowledge_base.config import RAGConfig
# from app.core.logger import AsyncLogger # Async usage in sync method is tricky without creating task

class IngestionService:
    def __init__(self):
        AgentConfig.validate()
        self.embeddings = OpenAIEmbeddings(
            api_key=AgentConfig.OPENAI_API_KEY,
            base_url=AgentConfig.OPENAI_BASE_URL,
            model=RAGConfig.EMBEDDING_MODEL
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=RAGConfig.CHUNK_SIZE,
            chunk_overlap=RAGConfig.CHUNK_OVERLAP
        )

    def load_document(self, file_path: str) -> List[Document]:
        """Load a document based on extension."""
        ext = os.path.splitext(file_path)[1].lower()
        if ext == ".pdf":
            loader = PyPDFLoader(file_path)
        elif ext == ".txt":
            loader = TextLoader(file_path)
        elif ext == ".docx":
            loader = Docx2txtLoader(file_path)
        else:
            raise ValueError(f"Unsupported file type: {ext}")
        
        return loader.load()

    def ingest_documents(self, file_paths: List[str], domain: str, output_path: str = None):
        """
        Ingest list of files into a FAISS index for a specific domain.
        Note: This is a synchronous blocking operation (CPU bound).
        """
        module_name = "IngestionService"
        all_splits = []
        
        print(f"[{module_name}] Starting ingestion for {len(file_paths)} files in domain '{domain}'")
        
        for file_path in file_paths:
            print(f"Loading {file_path}...")
            try:
                raw_docs = self.load_document(file_path)
                
                # Enrich metadata
                file_name = os.path.basename(file_path)
                for doc in raw_docs:
                    doc.metadata.update({
                        "domain": domain,
                        "file_name": file_name,
                        "upload_timestamp": time.time(),
                        "sku_id": None 
                    })
                
                splits = self.text_splitter.split_documents(raw_docs)
                all_splits.extend(splits)
                print(f"Processed {len(splits)} chunks from {file_name}")
                
            except Exception as e:
                print(f"ERROR: Failed to load {file_path}: {e}")
                # Ideally log to DB here but need async context or sync wrapper
                
        if not all_splits:
            print("No documents processed. Index creation skipped.")
            return

        try:
            print(f"Creating FAISS index with {len(all_splits)} chunks...")
            vector_store = FAISS.from_documents(all_splits, self.embeddings)
            
            save_path = output_path or RAGConfig.get_index_path(domain)
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            vector_store.save_local(save_path)
            print(f"SUCCESS: Index saved to {save_path}")
            
        except Exception as e:
            print(f"CRITICAL ERROR: Failed to create/save FAISS index: {e}")

# Singleton
ingestion_service = IngestionService()
