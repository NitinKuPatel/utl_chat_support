# How to Run the Backend Server

This guide provides a quick checklist to get the UTL Chat Support backend running locally.

## Prerequisites

1.  **Python 3.10+**: Ensure Python is installed and added to your PATH.
2.  **MongoDB**: You need a running MongoDB instance (locally or Atlas).
    *   *Local*: Install MongoDB Community Server and start it (`mongod`).
    *   *Connection String*: Default is `mongodb://localhost:27017`.

## Quick Start (Windows)

1.  **Open Terminal**: Navigate to this folder (`utl_chat_support`).

2.  **Environment Setup** (First time only):
    ```powershell
    # Create virtual environment
    python -m venv venv
    
    # Activate it
    .\venv\Scripts\activate
    
    # Install dependencies
    pip install -r requirements.txt
    ```

3.  **Configuration**:
    *   Make sure you have a `.env` file.
    *   If not, copy the example: `copy .env.example .env`
    *   Edit `.env` and add your `OPENAI_API_KEY`.

4.  **Start Server**:
    ```powershell
    uvicorn app.main:app --reload
    ```
    
5.  **Verify**:
    *   Open your browser to: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
    *   You should see the Swagger UI.

## Troubleshooting

*   **Error: `start_server` not recognized**: Make sure you activated the venv (`.\venv\Scripts\activate`).
*   **Error: Connection refused (MongoDB)**: Check if MongoDB is running (`Task Manager` -> `Services` -> `MongoDB`).
*   **Error: API Key missing**: Check your `.env` file.

## Helper Script

You can create a file named `run.bat` with the following content to start it in one click:
```batch
@echo off
call .\venv\Scripts\activate
uvicorn app.main:app --reload
pause
```
