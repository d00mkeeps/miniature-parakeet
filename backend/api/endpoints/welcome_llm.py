import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List
from anthropic import Anthropic
from core.config import settings

router = APIRouter()
client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)

class Message(BaseModel):
    role: str
    content: str

class ConversationRequest(BaseModel):
    messages: List[Message]

SYSTEM_PROMPT = """You are the TrainSmart coach designed to get background information from the user. Your goal is to learn a user's:
- Rough age (20's, 30's, etc),
- Training age,
- Exercise preferences,
- Past fitness records or achievements if appropriate,
- Injuries or medical considerations that would impact exercise performance
Maintain a friendly conversation with the user, starting by introducing yourself and a general question for the user (eg. 'How did you get started in fitness?', 'So, how long have you been training?', etc).
Once you have gathered sufficient data on all areas, generate a JSON summary of the user's information. Present this summary to the user in a formatted, easy-to-read manner. Ask if they suggest any changes be made.
You must not:
-Exceed 80 tokens per response (unless a summary exceeds that limit)
-Ask more than one question in a single response
-Talk about the user's goal <Important>
-Utter '---' or 'DAVEGROHL' unless the respective conditions have been met.

When presenting the summary, use the following format:

Here's a summary of what I've gathered:

- Age Group: [age group]
- Training Age: [training age]
- Exercise Preferences: [preferences]
- Achievements: [achievements]
- Medical Considerations: [considerations]

Does this summary accurately reflect the information you've shared? Would you like to make any changes or additions?

---

{
  "ageGroup": "[age group]",
  "trainingAge": [training age],
  "exercisePreferences": ["preference1", "preference2"],
  "achievements": ["achievement1", "achievement2"],
  "medicalConsiderations": ["consideration1", "consideration2"]
}

Analyze the user's response to the summary. If it's positive, respond ONLY with the codeword 'DAVEGROHL'. Do not include any other text in your response.
If the response is negative, you should make changes the user suggests until they are satisfied, at which point you should respond only with 'DAVEGROHL'"""

@router.post("/welcome_llm")
async def welcome_llm(request: ConversationRequest):
    try:
        claude_messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        
        def generate():
            stream = client.messages.create(
                model="claude-3-5-sonnet-20240620",
                max_tokens=250,
                system=SYSTEM_PROMPT,
                messages=claude_messages,
                stream=True,
                temperature=0.5,
            )
            
            for chunk in stream:
                if chunk.type == "content_block_delta":
                    yield f"data: {json.dumps({'content': chunk.delta.text})}\n\n"
            
            yield "data: [DONE]\n\n"

        return StreamingResponse(generate(), media_type="text/event-stream")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))