from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class Database:
    client: AsyncIOMotorClient = None
    db = None

    def connect(self):
        self.client = AsyncIOMotorClient(settings.MONGODB_URI)
        self.db = self.client[settings.MONGODB_DATABASE]
        print(f"Connected to MongoDB: {settings.MONGODB_DATABASE}")

    def close(self):
        if self.client:
            self.client.close()
            print("Disconnected from MongoDB")

db = Database()

def get_database():
    return db.db
