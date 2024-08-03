import os
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import anthropic
from dotenv import load_dotenv

load_dotenv()

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

anthropic_api_key: str = os.getenv("ANTHROPIC_API_KEY")
if not anthropic_api_key:
    raise ValueError("Anthropic API key not found in environment variables")

anthropic_client = anthropic.Anthropic(api_key=anthropic_api_key)

app = FastAPI()

class GoalSettingRequest(BaseModel):
    user_id: int
    initial_goal: str
    training_history: str
    current_goals: str

@app.post("/improve_goal")
async def improve_goal(request: GoalSettingRequest):
    # Log the received data
    logger.info(f"Received goal improvement request for user {request.user_id}")
    logger.debug(f"Request data: {request.dict()}")

    try:
        improved_goal = get_improved_goal(request)
        logger.info(f"Generated improved goal for user {request.user_id}")
        logger.debug(f"Improved goal: {improved_goal}")
        return {"improved_goal": improved_goal}
    except Exception as e:
        logger.error(f"Error processing goal improvement request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def get_improved_goal(request: GoalSettingRequest) -> str:
    try:
        formatted_input = f"""User Context:
User ID: {request.user_id}
Training History: {request.training_history}
Current Goals: {request.current_goals}

Initial Goal: {request.initial_goal}

Please analyze the user's context and initial goal, then provide an improved, more specific, and actionable goal."""

        logger.debug(f"Sending request to Anthropic for user {request.user_id}")
        message = anthropic_client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=500,
            temperature=0.7,
            system="You are an expert strength and conditioning coach specializing in goal setting. Your task is to analyze the user's training history, current goals, and their initial goal to provide a more specific, measurable, achievable, relevant, and time-bound (SMART) goal. Your response should be concise and directly state the improved goal without any additional explanation.",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": formatted_input
                        }
                    ]
                }
            ]
        )
        
        improved_goal = message.content
        logger.info(f"Improved goal generated for user {request.user_id}")
        logger.debug(f"Improved goal: {improved_goal}")
        return improved_goal

    except Exception as e:
        logger.error(f"Error generating improved goal: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating improved goal: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)