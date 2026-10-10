from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .questions import public_questions
from .schemas import AnalyzeRequest, ChatRequest
from .chat import ask
from .analysis import analyze
from .recommendations import RECS

app = FastAPI(title="DSA GapFinder API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/api/health")
def health(): return {"status": "ok"}

@app.get("/api/questions")
def questions(): return public_questions()

@app.post("/api/assessments/analyze")
def analyze_ep(req: AnalyzeRequest):
    try: return analyze(req.answers)
    except ValueError as e: raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/recommendations/{topic}")
def rec(topic: str):
    if topic not in RECS: raise HTTPException(status_code=404, detail=f"Unknown topic: {topic}")
    return RECS[topic]

@app.post("/api/chat")
def chat(req: ChatRequest):
    msg = req.message.strip()
    if not msg: raise HTTPException(status_code=400, detail="Please type a question.")
    if len(msg) > 1000: raise HTTPException(status_code=400, detail="Question too long (max 1000 characters).")
    hist = [{"role": t.role, "content": t.content[:1000]} for t in req.history if t.role in ("user", "assistant")]
    return ask(msg, hist)
