from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from api.endpoints import timeframe_router, goals_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(timeframe_router, prefix="/api", tags=["timeframe"])
app.include_router(goals_router, prefix="/api", tags=["goals"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Workout Data API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)