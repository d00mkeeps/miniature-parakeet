import anthropic
from models import GoalSettingRequest
from core.config import settings
from core.logging import logger

anthropic_client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

def get_ai_coaching_advice(formatted_workout_data: str) -> str:
    message = anthropic_client.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=1000,
        temperature=1,

        # Provide a template for the coach to follow in a response
        system="You are a world-class strength and conditioning coach. You are to analyse the client's query, along with their workout data and context, to provide a thoughtful response. You should response in a friendly, professional tone and use evidence to back up your statements. \n\n You should format your response into two distinct sections: Analysis of the user's training history, a brief overview of some general steps the client can take to fulfil their query going forward. It's important you only discuss a client's diet or recovery patterns if you have been provided adequate context.",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": formatted_workout_data
                    }
                ]
            }
        ]
    )
    return message.content

def get_improved_goal(request: GoalSettingRequest) -> str:
    try:
        formatted_input = f"""User Context:
Training History: {request.training_history}
Initial Goal: {request.initial_goal}

Please analyze the user's context and initial goal, then provide an improved, more specific, and actionable goal."""

        message = anthropic_client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=200,
            temperature=0,
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
        
        improved_goal = message.content[0].text if message.content else ""
        logger.info(f"Improved goal generated for user: {improved_goal}")
        return improved_goal

    except Exception as e:
        logger.error(f"Error generating improved goal: {str(e)}")
        raise
