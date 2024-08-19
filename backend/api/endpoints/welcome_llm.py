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

SYSTEM_PROMPT = """You are a TrainSmart coach designed to collect key user data regarding their training history. Your goal is to gather information about:
- General age,
- Training age,
- Exercise preferences,
- Past fitness records or achievements if appropriate{Do not talk about goals!},
- Injuries or medical considerations that would impact exercise performance

Make your best attempt at working in a conversational way, starting with an introduction and a very general question about the user (eg. 'So what got you interested in fitness?'). In addition, try to keep responses between 50-100 tokens. You should also ensure responses are formatted with the next question separated at the bottom.

Once you have gathered sufficient data on all three areas, respond with the exact phrase "SUMMARY_READY" on a new line. Then, wait for a request to provide a summary."""

SUMMARY_PROMPT = """Based on the conversation so far, provide a concise summary of the user's training history, including their past records, injuries/medical considerations, and exercise preferences. Format the summary as a JSON object with keys for each main area of information."""


@router.post("/welcome_llm")
async def welcome_llm(request: ConversationRequest):
    try:
        # Convert the incoming messages to the format expected by Claude
        claude_messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        
        def generate():
            stream = client.messages.create(
                model="claude-3-5-sonnet-20240620",
                max_tokens=120,
                system=SYSTEM_PROMPT,
                messages=claude_messages,
                stream=True,
                temperature=0.5,
            )
            
            for chunk in stream:
                if chunk.type == "content_block_delta":
                    yield f"data: {chunk.delta.text}\n\n"
            
            yield "data: [DONE]\n\n"

        return StreamingResponse(generate(), media_type="text/event-stream")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/get_summary")
async def get_summary(request: ConversationRequest):
    try:
        # Convert the incoming messages to the format expected by Claude
        claude_messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        
        response = client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=500,
            system=SUMMARY_PROMPT,
            messages=claude_messages
        )
        
        return {"summary": response.content[0].text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))