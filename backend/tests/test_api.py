from fastapi.testclient import TestClient
from app.main import app
from app.questions import QUESTIONS
from app.analysis import analyze, categorize

c = TestClient(app)

def test_health(): assert c.get("/api/health").json()["status"] == "ok"

def test_questions_hide_answers():
    qs = c.get("/api/questions").json()
    assert len(qs) >= 30 and all("answer" not in q for q in qs)

def test_scoring():
    ans = {q["id"]: (q["answer"] if q["topic"] == "Arrays" else (q["answer"] + 1) % 4) for q in QUESTIONS}
    r = analyze(ans)
    assert r["strongest"] == "Arrays" and "Recursion" in r["weak_topics"]
    assert r["topics"][0]["accuracy"] == 100.0

def test_not_assessed():
    r = analyze({"arr1": 0})
    assert [t for t in r["topics"] if t["topic"] == "Trees"][0]["category"] == "Not Assessed"

def test_categories():
    assert categorize(80) == "Strong" and categorize(60) == "Developing" and categorize(59.9) == "Needs Improvement"

def test_invalid():
    assert c.post("/api/assessments/analyze", json={"answers": {}}).status_code == 400
    assert c.post("/api/assessments/analyze", json={"answers": {"zzz": 1}}).status_code == 400
    assert c.post("/api/assessments/analyze", json={"answers": {"arr1": 9}}).status_code == 400
    assert c.post("/api/assessments/analyze", json={"bad": 1}).status_code == 422

def test_chat_local_fallback(monkeypatch):
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    r = c.post("/api/chat", json={"message": "What is recursion?"}).json()
    assert r["source"] == "local" and "base case" in r["answer"].lower()

def test_chat_validation():
    assert c.post("/api/chat", json={"message": "   "}).status_code == 400
    assert c.post("/api/chat", json={"message": "x" * 1001}).status_code == 400
