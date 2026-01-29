# UTL Check Support - Domain-Aware Agentic AI Backend

A robust, enterprise-grade backend for the UTL Helpdesk Chat Support system. Built with FastAPI, LangGraph, and MongoDB, this system features a domain-aware RAG agent capable of persistent conversations, comprehensive logging, and standard chat history management.

## 🚀 Key Features

*   **Agentic AI Core**: Powered by **LangGraph** (ReAct architecture) to reason, plan, and execute tool calls.
*   **Domain-Aware RAG**: Intelligent retrieval system that routes queries to specific domains (Customer/Employee) using **FAISS** vector stores.
*   **Robust Persistence**:
    *   **Session Memory**: Uses a custom `AsyncMongoDBSaver` to persist agent state in MongoDB (`agent_checkpoints`), enabling multi-round conversations across server restarts.
    *   **Chat History**: Standard message logging in MongoDB (`chat_history`) for compliance and review.
*   **Enterprise Logging**: Asynchronous logging system (`AsyncLogger`) that captures INFO, WARN, and ERROR logs with stack traces to MongoDB (`system_logs`).
*   **Resilience**: Global error handling and graceful degradation to prevent system crashes.

## 🛠️ Tech Stack

*   **Language**: Python 3.10+
*   **API Framework**: FastAPI
*   **AI/LLM orchestration**: LangChain, LangGraph
*   **Database**: MongoDB (Atlas or Local)
*   **Vector Store**: FAISS (Local CPU)
*   **LLM Provider**: OpenRouter (OpenAI/Mistral/etc.)

## 📂 Project Structure

```
utl_chat_support/
├── app/
│   ├── agent/          # Agent logic, tools, router, and persistence
│   ├── core/           # Config and Logger
│   ├── db/             # Database connection and repositories
│   ├── knowledge_base/ # RAG Ingestion and Retrieval services
│   └── main.py         # App entry point
├── data/               # Vector stores and raw documents
├── .env.example        # Template for environment variables
├── requirements.txt    # Project dependencies
└── README.md           # This file
```

## ⚙️ Setup & Installation

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd utl_chat_support
    ```

2.  **Create Virtual Environment**
    ```bash
    python -m venv venv
    # Windows
    .\venv\Scripts\activate
    # Linux/Mac
    source venv/bin/activate
    ```

3.  **Install Dependencies**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configuration**
    *   Copy `.env.example` to `.env`.
    *   Fill in your credentials:
        ```ini
        MONGODB_URI=mongodb://localhost:27017
        MONGODB_DATABASE=user_management
        OPENAI_API_KEY=sk-your-key
        ```

## 🏃‍♂️ Running the Application

Start the FastAPI server using `uvicorn`:

```bash
uvicorn app.main:app --reload
```
The server will start at `http://127.0.0.1:8000`.

## 📡 API Endpoints

### 1. Chat Interface
*   **POST** `/agent/chat`
    *   **Payload**: `{"session_id": "user123", "message": "My internet is down"}`
    *   **Response**: `{"response": "...", "used_tools": ["rag_search"]}`

### 2. Chat History
*   **GET** `/agent/history/{session_id}`
    *   Retrieve conversation history for a specific session.
*   **GET** `/agent/all_chats`
    *   Retrieve all chat records (paginated).

## 🧪 Testing

Run the included verification scripts to ensure everything is working:

*   `python test_rag_flow.py`: Verifies Document Ingestion and Retrieval.
*   `python test_chat_history.py`: Verifies Message Storage and Retrieval.
*   `python test_persistence.py`: Verifies Session Memory across restarts.