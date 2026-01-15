from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

# Suppress FAISS loader warnings
logging.getLogger("faiss.loader").setLevel(logging.ERROR)
from app.core.config import settings
from app.db.mongodb import db, get_database
from app.auth import routes as auth_routes
from app.users import routes as user_routes
from app.users.services import bootstrap_super_admin
from app.agent import router as agent_router
from app.knowledge_base import routes as knowledge_routes
from app.tickets import routes as tickets_routes
from app.dashboard import routes as dashboard_routes

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Centralized User Management Backend",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)



# Startup Events
@app.on_event("startup")
async def startup_db_client():
    db.connect()
    try:
        await bootstrap_super_admin()
    except Exception as e:
        print(f"Error during bootstrap: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    db.close()

# Include Routers
app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
app.include_router(user_routes.router, prefix="/users", tags=["Users"])
app.include_router(agent_router.router)
app.include_router(knowledge_routes.router, prefix="/knowledge", tags=["Knowledge Base"])
app.include_router(tickets_routes.router)
app.include_router(dashboard_routes.router, prefix="/dashboard", tags=["Dashboard"])

@app.get("/")
async def root():
    return {"message": "Welcome to Centralized User Management Backend"}
