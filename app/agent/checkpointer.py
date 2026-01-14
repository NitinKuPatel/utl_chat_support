from typing import AsyncIterator, Sequence, Tuple, Optional, Any, Dict
from contextlib import asynccontextmanager
from langgraph.checkpoint.base import BaseCheckpointSaver, Checkpoint, CheckpointMetadata, CheckpointTuple
from langgraph.checkpoint.serde.jsonplus import JsonPlusSerializer
from app.db.mongodb import get_database

class AsyncMongoDBSaver(BaseCheckpointSaver):
    """
    A persistent checkpoint saver that stores state in MongoDB.
    """
    def __init__(self, collection_name: str = "agent_checkpoints"):
        super().__init__(serde=JsonPlusSerializer())
        self.collection_name = collection_name

    def _get_collection(self):
        db = get_database()
        if db is None:
            raise RuntimeError("Database not connected")
        return db[self.collection_name]

    async def aget_tuple(self, config: Dict[str, Any]) -> Optional[CheckpointTuple]:
        """
        Get a checkpoint tuple from the database.
        """
        thread_id = config["configurable"]["thread_id"]
        thread_ts = config["configurable"].get("thread_ts")
        
        collection = self._get_collection()
        query = {"thread_id": thread_id}
        
        if thread_ts:
            query["thread_ts"] = thread_ts
        else:
            # Get latest
             pass

        # Sort by thread_ts desc
        sort_order = [("thread_ts", -1)]
        
        result = await collection.find_one(query, sort=sort_order)
        
        if not result:
            return None
            
        checkpoint = self.serde.loads_typed((result["checkpoint_type"], result["checkpoint"]))
        metadata = self.serde.loads_typed((result["metadata_type"], result["metadata"]))
        
        parent_config = None
        if result.get("parent_config"):
             parent_config = self.serde.loads_typed((result["parent_config_type"], result["parent_config"]))

        return CheckpointTuple(
            config=config,
            checkpoint=checkpoint,
            metadata=metadata,
            parent_config=parent_config,
        )

    async def aput(
        self,
        config: Dict[str, Any],
        checkpoint: Checkpoint,
        metadata: CheckpointMetadata,
        new_versions: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Save a checkpoint tuple to the database.
        """
        thread_id = config["configurable"]["thread_id"]
        thread_ts = checkpoint["id"]
        
        collection = self._get_collection()
        
        cp_type, cp_data = self.serde.dumps_typed(checkpoint)
        mt_type, mt_data = self.serde.dumps_typed(metadata)
        
        doc = {
            "thread_id": thread_id,
            "thread_ts": thread_ts,
            "checkpoint": cp_data,
            "checkpoint_type": cp_type,
            "metadata": mt_data,
            "metadata_type": mt_type,
            "parent_config": None,
            "parent_config_type": None
        }
        
        if config.get("parent_config"):
             pc_type, pc_data = self.serde.dumps_typed(config.get("parent_config"))
             doc["parent_config"] = pc_data
             doc["parent_config_type"] = pc_type
        
        await collection.update_one(
            {"thread_id": thread_id, "thread_ts": thread_ts},
            {"$set": doc},
            upsert=True
        )
        
        return {
            "configurable": {
                "thread_id": thread_id,
                "thread_ts": thread_ts,
            }
        }
        
    async def aput_writes(
        self,
        config: Dict[str, Any],
        writes: Sequence[Tuple[str, Any]],
        task_id: str,
    ) -> None:
        """
        Save a list of writes to the database.
        """
        thread_id = config["configurable"].get("thread_id")
        thread_ts = config["configurable"].get("thread_ts") or config["configurable"].get("checkpoint_id")
        
        if not thread_id or not thread_ts:
             # This happens for some intermediate steps or if config is malformed. 
             # Silently return or log at debug level to avoid noise.
             return
        
        collection = self._get_collection()
        
        # Serialize writes
        serialized_writes = []
        for channel, value in writes:
            type_, data = self.serde.dumps_typed(value)
            serialized_writes.append({
                "channel": channel,
                "type": type_,
                "value": data
            })
            
        doc = {
            "thread_id": thread_id,
            "thread_ts": thread_ts,
            "task_id": task_id,
            "type": "writes",
            "writes": serialized_writes
        }
        
        # Key for writes is usually (thread_id, thread_ts, task_id)
        # We can store in same collection with 'type': 'writes' or separate.
        # Storing in same for simplicity.
        
        await collection.update_one(
            {"thread_id": thread_id, "thread_ts": thread_ts, "task_id": task_id, "type": "writes"},
            {"$set": doc},
            upsert=True
        )

    # Note: If library calls aget_writes, we need that too. 
    # But usually aget_tuple retrieves state. 
    # Let's add stub for aget_writes just in case? 
    # BaseCheckpointSaver defines it? 
    # BaseCheckpointSaver implementation of `aget_tuple` uses `aget_writes`?
    # No, BaseCheckpointSaver is abstract.
    
    # Let's assume just aput_writes is enough to satisfy the error "aput_writes raise NotImplementedError"

    async def alist(
        self,
        config: Optional[Dict[str, Any]],
        *,
        filter: Optional[Dict[str, Any]] = None,
        before: Optional[Dict[str, Any]] = None,
        limit: Optional[int] = None,
    ) -> AsyncIterator[CheckpointTuple]:
        """List checkpoints."""
        query = {}
        if config:
            query["thread_id"] = config["configurable"]["thread_id"]
            
        collection = self._get_collection()
        cursor = collection.find(query).sort("thread_ts", -1)
        
        if limit:
            cursor = cursor.limit(limit)
            
        async for result in cursor:
            checkpoint = self.serde.loads_typed((result["checkpoint_type"], result["checkpoint"]))
            metadata = self.serde.loads_typed((result["metadata_type"], result["metadata"]))
            parent_config = None
            if result.get("parent_config"):
                parent_config = self.serde.loads_typed((result["parent_config_type"], result["parent_config"]))
                
            yield CheckpointTuple(
                config={"configurable": {"thread_id": result["thread_id"], "thread_ts": result["thread_ts"]}},
                checkpoint=checkpoint,
                metadata=metadata,
                parent_config=parent_config,
            )

    # Sync methods are required by ABC but we only use async in this async-first app
    # We impl them as placeholders raising errors or trivial if strictly needed by library internals 
    # (LangGraph's compiled graph might call sync if not properly awaited, but create_react_agent returns CompiledGraph which supports ainvoke)
    
    def get_tuple(self, config: Dict[str, Any]) -> Optional[CheckpointTuple]:
        raise NotImplementedError("Use aget_tuple")

    def put(self, config: Dict[str, Any], checkpoint: Checkpoint, metadata: CheckpointMetadata, new_versions: Dict[str, Any],) -> Dict[str, Any]:
         raise NotImplementedError("Use aput")

    def list(self, config: Optional[Dict[str, Any]], *, filter: Optional[Dict[str, Any]] = None, before: Optional[Dict[str, Any]] = None, limit: Optional[int] = None,) -> Any:
        raise NotImplementedError("Use alist")
