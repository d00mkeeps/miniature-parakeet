from pydantic import BaseModel

class GoalSettingRequest(BaseModel):
    user_id: int
    initial_goal: str
    training_history: str
    current_goals: str