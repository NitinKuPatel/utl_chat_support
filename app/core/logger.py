import logging
import traceback
from datetime import datetime
from typing import Any, Dict, Optional
from app.db.mongodb import get_database

# Configure standard python logging as fallback
logging.basicConfig(level=logging.INFO)
std_logger = logging.getLogger("agentic_system")

class AsyncLogger:
    """
    Asynchronous logger that writes to MongoDB 'system_logs' collection.
    Falls back to standard logger on failure.
    """
    
    COLLECTION_NAME = "system_logs"

    @classmethod
    async def log(cls, level: str, message: str, module: str = "unknown", metadata: Optional[Dict[str, Any]] = None):
        """
        Write a log entry.
        """
        log_entry = {
            "timestamp": datetime.utcnow(),
            "level": level.upper(),
            "module": module,
            "message": message,
            "metadata": metadata or {}
        }
        
        # 1. Print to Stdout (Immediate feedback)
        if level.upper() == "ERROR":
            std_logger.error(f"[{module}] {message} | Meta: {metadata}")
        elif level.upper() == "WARN":
            std_logger.warning(f"[{module}] {message}")
        else:
            std_logger.info(f"[{module}] {message}")

        # 2. Write to DB (Persist)
        try:
            db = get_database()
            if db is not None:
                await db[cls.COLLECTION_NAME].insert_one(log_entry)
        except Exception as e:
            # Fallback if DB fails (don't crash the logger)
            std_logger.error(f"Failed to write logs to DB: {e}")

    @classmethod
    async def info(cls, message: str, module: str, metadata: Optional[Dict[str, Any]] = None):
        await cls.log("INFO", message, module, metadata)

    @classmethod
    async def error(cls, message: str, module: str, error: Exception = None, metadata: Optional[Dict[str, Any]] = None):
        meta = metadata or {}
        if error:
            meta["error_str"] = str(error)
            meta["traceback"] = traceback.format_exc()
        
        await cls.log("ERROR", message, module, meta)

    @classmethod
    async def warn(cls, message: str, module: str, metadata: Optional[Dict[str, Any]] = None):
        await cls.log("WARN", message, module, metadata)
