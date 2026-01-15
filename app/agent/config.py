import os
from dotenv import load_dotenv

load_dotenv()

class AgentConfig:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL")
    MODEL_NAME = os.getenv("OPENAI_MODEL") or os.getenv("MODEL_NAME", "gpt-4o-mini")
    
    @classmethod
    def validate(cls):
        if not cls.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY is not set in environment variables")
