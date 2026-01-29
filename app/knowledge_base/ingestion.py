import os
import time
import uuid
import shutil
from typing import List, Optional
from langchain_core.documents import Document
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, TextLoader, Docx2txtLoader

from app.agent.config import AgentConfig
from app.knowledge_base.config import RAGConfig
from app.knowledge_base.models import KnowledgeMetadata, DomainType
from app.db.mongodb import get_database

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

    async def ingest_file(
        self, 
        file_path: str, 
        domain: DomainType, 
        model_number: Optional[str] = None,
        doc_type: Optional[str] = None,
        product_category: Optional[str] = None,
        original_name: Optional[str] = None
    ) -> str:
        """
        Ingest a single file into the FAISS index for a specific domain.
        Returns the generated file_id.
        """
        file_id = str(uuid.uuid4())
        # Use provided original name or fallback to basename (which might be a temp name)
        file_name = original_name if original_name else os.path.basename(file_path)
        
        print(f"[Ingestion] Processing {file_name} for domain '{domain}'")
        
        # 1. Load and Split
        try:
            raw_docs = self.load_document(file_path)
        except Exception as e:
            raise ValueError(f"Failed to load document: {str(e)}")

        # 2. Enrich Metadata
        for doc in raw_docs:
            doc.metadata.update({
                "domain": domain,
                "file_name": file_name,
                "file_id": file_id,
                "upload_timestamp": time.time(),
                "model_number": model_number,
                "doc_type": doc_type,
                "product_category": product_category
            })
        
        splits = self.text_splitter.split_documents(raw_docs)
        if not splits:
            raise ValueError("No text content found in document")
            
        print(f"[Ingestion] Generated {len(splits)} chunks")

        # 3. Update Vector Store (Incremental)
        index_path = RAGConfig.get_index_path(domain)
        
        if os.path.exists(index_path) and os.path.exists(os.path.join(index_path, "index.faiss")):
            print(f"[Ingestion] Loading existing index from {index_path}")
            vector_store = FAISS.load_local(index_path, self.embeddings, allow_dangerous_deserialization=True)
            vector_store.add_documents(splits)
        else:
            print(f"[Ingestion] Creating new index at {index_path}")
            vector_store = FAISS.from_documents(splits, self.embeddings)
            os.makedirs(os.path.dirname(index_path), exist_ok=True)

        vector_store.save_local(index_path)
        
        # 4. Save Metadata to MongoDB
        metadata = KnowledgeMetadata(
            file_id=file_id,
            file_name=file_name,
            domain=domain,
            model_number=model_number,
            doc_type=doc_type,
            product_category=product_category,
            chunk_count=len(splits)
        )
        
        db = get_database()
        await db.knowledge_base.insert_one(metadata.dict())
        
        return file_id

    async def delete_file(self, file_id: str):
        """
        Delete a file from MongoDB and remove its chunks from FAISS.
        Note: FAISS delete is tricky. We typically need to rebuild or use docstore IDs.
        For simplicity in this version, we will just remove metadata from DB.
        Real deletion from FAISS requires tracking IDs or rebuilding index.
        To keep it simple but functional: checking metadata existence during retrieval is a common pattern,
        or we can try to delete by ID if we indexed with IDs.
        
        Current approach: Delete metadata from DB. 
        TODO for future: Implement full vector deletion/reindexing.
        """
        db = get_database()
        result = await db.knowledge_base.delete_one({"file_id": file_id})
        if result.deleted_count == 0:
            raise ValueError("File not found")
        
        # Ideally we'd remove from FAISS too. 
        # Without ID tracking in FAISS, we can't easily remove specific docs.
        # We will mark for re-indexing or rely on metadata filtering if implemented.
        print(f"[Ingestion] Deleted metadata for {file_id}. Vector chunks remain until re-index.")

# Singleton
ingestion_service = IngestionService()
