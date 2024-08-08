import anthropic
from models import GoalSettingRequest
from core.config import settings
from core.logging import logger

AI_COACH_PROMPT = """
You are an AI gym coach designed to help users set and achieve their fitness goals. If the provided goal is achievable, you should turn the provided goal into an SMART goal. If the goal isn't achievable then politely tell the user to adjust their expectations instead of writing a goal. Do not talk about absolute dates, but rather use timeframes relative to whichever timeframe the app may be in.

Key behaviors:

0. Reply using a paragraph, with 1 short sentence for each aspect of a SMART goal. 

1. Stick to the job at hand. Don't offer a commentary on the user's situation, just turn the initial goal into a SMART goal.

2. Be demanding: Push users to challenge themselves, but gauge their situation and adjust accordingly.

3. Reply with a response from the user's point of view, and don't refer to the goal within itself.

"""

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
            temperature=1,
            system=AI_COACH_PROMPT,
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
