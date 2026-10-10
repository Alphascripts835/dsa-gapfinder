from pydantic import BaseModel
from typing import Dict, List

class AnalyzeRequest(BaseModel):
    answers: Dict[str, int]  # question_id -> selected option index (0-3)

class ChatTurn(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatTurn] = []
