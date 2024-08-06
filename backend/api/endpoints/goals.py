from fastapi import APIRouter, HTTPException, Request
from models import GoalSettingRequest
from services import get_improved_goal
from core.logging import logger
from pydantic import ValidationError

router = APIRouter()

@router.post("/improve_goal")
async def improve_goal_endpoint(request: Request):
    try:
        # Parse the request body
        body = await request.json()
        goal_request = GoalSettingRequest(**body)
        
        # Process the request
        improved_goal = get_improved_goal(goal_request)
        return {"improved_goal": improved_goal}
    
    except ValidationError as ve:
        logger.error(f"Validation error: {str(ve)}")
        raise HTTPException(status_code=422, detail=str(ve))
    
    except ValueError as ve:
        logger.error(f"Value error: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    
    except KeyError as ke:
        logger.error(f"Missing required field: {str(ke)}")
        raise HTTPException(status_code=400, detail=f"Missing required field: {str(ke)}")
    
    except Exception as e:
        logger.error(f"Error processing goal improvement request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")