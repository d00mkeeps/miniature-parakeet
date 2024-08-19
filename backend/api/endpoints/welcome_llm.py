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

@router.post("/welcome_llm")
async def welcome_llm(request: ConversationRequest):
    try:
        claude_messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        
        def generate():
            stream = client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=1000,
                messages=claude_messages,
                stream=True
            )
            
            for chunk in stream:
                if chunk.type == "content_block_delta":
                    yield f"data: {chunk.delta.text}\n\n"
            
            yield "data: [DONE]\n\n"

        return StreamingResponse(generate(), media_type="text/event-stream")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))