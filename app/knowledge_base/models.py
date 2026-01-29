from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class DomainType(str, Enum):
    CUSTOMER = "customer"
    EMPLOYEE = "employee"

class KnowledgeMetadata(BaseModel):
    file_id: str
    file_name: str
    domain: DomainType
    upload_timestamp: datetime = Field(default_factory=datetime.utcnow)
    model_number: Optional[str] = None
    doc_type: Optional[str] = None
    product_category: Optional[str] = None
    version: int = 1
    chunk_count: int

class UploadResponse(BaseModel):
    file_id: str
    message: str
    metadata: KnowledgeMetadata

class FileListItem(BaseModel):
    file_id: str
    file_name: str
    domain: str
    upload_timestamp: datetime
    model_number: Optional[str] = None
    doc_type: Optional[str] = None
    product_category: Optional[str] = None
