import os
import shutil
import tempfile
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from app.knowledge_base.ingestion import ingestion_service
from app.knowledge_base.models import UploadResponse, DomainType, FileListItem
from app.db.mongodb import get_database

router = APIRouter()

@router.post("/upload", response_model=UploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    domain: DomainType = Form(...),
    model_number: Optional[str] = Form(None),
    doc_type: Optional[str] = Form(None),
    product_category: Optional[str] = Form(None)
):
    """
    Upload a document to the knowledge base.
    EXTRACTS text, EMBEDS chunks, UPDATES FAISS index, and STORES metadata.
    """
    allowed_extensions = {".pdf", ".txt", ".docx"}
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail=f"Unsupported file type. Allowed: {allowed_extensions}")
    
    # Save to temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name
        
    try:
        # Pass to ingestion service
        file_id = await ingestion_service.ingest_file(
            file_path=tmp_path,
            domain=domain,
            model_number=model_number,
            doc_type=doc_type,
            product_category=product_category,
            original_name=file.filename
        )
        
        return {
            "file_id": file_id,
            "message": f"Successfully ingested {file.filename} into {domain} domain.",
            "metadata": {
                "file_id": file_id,
                "file_name": file.filename,
                "domain": domain,
                "model_number": model_number,
                "doc_type": doc_type,
                "product_category": product_category,
                "chunk_count": 0, # Ingestion service didn't return count, handled inside. 
                                  # Ideally modify ingestion to return full object, but simplest for now.
                "version": 1
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")
    finally:
        # Cleanup temp file
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@router.get("/", response_model=List[FileListItem])
async def list_files(
    domain: Optional[DomainType] = None,
    model_number: Optional[str] = None
):
    """List uploaded files with optional filtering."""
    db = get_database()
    query = {}
    if domain:
        query["domain"] = domain
    if model_number:
        query["model_number"] = model_number
        
    cursor = db.knowledge_base.find(query).sort("upload_timestamp", -1)
    files = await cursor.to_list(length=100)
    return files

@router.delete("/{file_id}")
async def delete_file(file_id: str):
    """Delete a file's metadata. (Vector index deletion is not fully supported yet)"""
    try:
        await ingestion_service.delete_file(file_id)
        return {"message": "File metadata deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
