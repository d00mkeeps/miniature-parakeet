from fastapi import APIRouter, HTTPException
from models import GoalSettingRequest
from services import get_improved_goal
from core.logging import logger

router = APIRouter()

@router.post("/improve_goal")
async def improve_goal_endpoint(request: GoalSettingRequest):
    try:
        improved_goal = get_improved_goal(request)
        return {"improved_goal": improved_goal}
    except Exception as e:
        logger.error(f"Error processing goal improvement request: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing goal improvement request")