import os
from dotenv import load_dotenv

load_dotenv()

class RAGConfig:
    # Domain configs
    EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small") # Using OpenAI embeddings for better quality
    
    # Vector DB Paths
    CUSTOMER_INDEX_PATH = "data/vector_store/customer"
    EMPLOYEE_INDEX_PATH = "data/vector_store/employee"
    
    # Chunking
    CHUNK_SIZE = 500
    CHUNK_OVERLAP = 100
    
    # Retrieval
    TOP_K = 3
    
    @classmethod
    def get_index_path(cls, domain: str) -> str:
        if domain == "employee":
            return cls.EMPLOYEE_INDEX_PATH
        return cls.CUSTOMER_INDEX_PATH
