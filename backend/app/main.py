from fastapi import FastAPI

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