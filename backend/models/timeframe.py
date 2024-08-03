from pydantic import BaseModel

class TimeframeRequest(BaseModel):
    timeframe: str
    user_id: int
    training_history: str
    goals: str