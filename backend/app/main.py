from fastapi import FastAPI

from app.db.supabase import supabase

app = FastAPI(
    title="TOEIC AI API",
    version="0.1.0",
)


@app.get("/health")
def health():
    return {
        "ok": True,
        "message": "TOEIC AI backend is running",
    }


@app.get("/health/db")
def health_db():
    response = supabase.table("test_connection").select("*").limit(1).execute()

    return {
        "ok": True,
        "data": response.data,
    }