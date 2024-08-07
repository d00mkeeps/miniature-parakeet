from pydantic import BaseModel

class GoalSettingRequest(BaseModel):
    initial_goal: str
    training_history: str
