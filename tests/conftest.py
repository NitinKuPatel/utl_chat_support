import pytest
import asyncio
from httpx import AsyncClient
from app.main import app
from app.core.config import settings
from app.db.mongodb import db, get_database
from motor.motor_asyncio import AsyncIOMotorClient

# Override settings for test
settings.MONGODB_DATABASE = "test_user_management"
settings.APP_ENV = "test"

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="function")
async def validation_db():
    # Setup
    db.connect()
    database = db.db
    # Clean before test
    await database.users.delete_many({})
    await database.counters.delete_many({})
    
    yield database
    
    # Teardown
    await database.users.delete_many({})
    await database.counters.delete_many({})
    db.close()

@pytest.fixture(scope="function")
async def client(validation_db):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.fixture
async def super_admin_token(client):
    # Bootstrap runs on startup, so super admin should exist IF startup event ran.
    # But AsyncClient doesn't trigger 'startup' event automatically unless using TestClient/Lifespan.
    # We'll explicitly create it or ensure it exists
    from app.users.services import bootstrap_super_admin
    await bootstrap_super_admin()
    
    login_data = {
        "email": settings.DEFAULT_SUPERADMIN_EMAIL,
        "password": settings.DEFAULT_SUPERADMIN_PASSWORD
    }
    response = await client.post("/auth/login", json=login_data)
    return response.json()["access_token"]
