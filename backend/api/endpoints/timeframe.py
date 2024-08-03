from fastapi import APIRouter, HTTPException
from models import TimeframeRequest
from services.timeframe_parser import parse_timeframe
from services.workout_data import fetch_workout_data
from services.ai_coach import get_ai_coaching_advice
from core.logging import logger

router = APIRouter()

@router.post("/parse_timeframe")
async def parse_timeframe_endpoint(request: TimeframeRequest):
    logger.info(f"Received query: {request.timeframe} for user_id: {request.user_id}")
    
    start_date, end_date = parse_timeframe(request.timeframe)
    
    try:
        query_bundle = fetch_workout_data(
            request.user_id, 
            start_date, 
            end_date, 
            request.timeframe,
            request.training_history,
            request.goals
        )
        
        ai_advice = get_ai_coaching_advice(query_bundle)
        
        response = {
            "formatted_data": query_bundle,
            "ai_advice": ai_advice
        }
        logger.info(f"Responding with: {response}")
        return response
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing request")