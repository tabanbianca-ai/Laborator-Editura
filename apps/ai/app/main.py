from fastapi import FastAPI

app = FastAPI(title="Laboratorul Editurii AI Service")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "ai"}
