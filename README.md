# DSA GapFinder — AI-Powered Coding Weakness Detector
*Find your gaps. Fix your concepts. Crack your next interview.*

**Problem statement:** Open Innovation — Student Pain Points.
**Problem:** students practise DSA without knowing which concepts are weak or what to practise next.
**Solution:** a diagnostic quiz, a transparent weakness-detection engine, local personalised practice plans, and progress tracking.
**Target users:** students preparing for technical interviews.

## Features (implemented)
Dashboard with empty state and labelled sample demo; 30-question diagnostic (10 topics × 3); server-side scoring; weaknesses page (sort/filter/detail); practice cards with localStorage completion; progress analytics (trend only with ≥2 saved assessments); API tests.
**Planned / not done:** optional generative-AI explanations, user accounts, larger question bank, survey results.

## DSA doubt chatbot (Ask DSA Doubts)
Ask any DSA question. With `ANTHROPIC_API_KEY` set in `backend/.env`, answers come from an AI model and are labelled "AI-generated". Without a key, a small built-in FAQ answers and is labelled "Local notes (rule-based, not AI)". The app works fully either way. Chats are not stored.

## Tech stack
React + Vite + Recharts + Lucide (plain CSS); FastAPI + Pydantic + Uvicorn; localStorage.

## Weakness detection algorithm (backend/app/analysis.py)
`topic_accuracy = correct / attempted × 100`. Strong ≥ 80, Developing 60–79, Needs Improvement < 60 (configurable in `THRESHOLDS`). Topics with no attempts are "Not Assessed" (not zero). Scores are computed server-side; the frontend never sends scores.
This is **rule-based**. No AI model is used or trained.

## Run locally
```bash
# backend
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8000
# frontend (new terminal)
cd frontend && npm install && npm run dev      # http://localhost:5173
# tests
cd backend && python -m pytest -q
```
Env: `frontend/.env` → `VITE_API_URL=http://localhost:8000` (optional; this is the default). No API keys needed.

## API
`GET /api/health` · `GET /api/questions` (no answers) · `POST /api/assessments/analyze` `{answers:{id:optionIndex}}` · `GET /api/recommendations/{topic}`

## Limitations
Only 3 questions per topic, so scores are coarse (33% steps). Results reflect performance on this diagnostic, not proof of mastery. Practice completion is self-reported. Progress history lives in one browser's localStorage.

## Survey evidence
See `evidence/` — placeholders only; no real survey has been run yet.

## Tools and AI used
Code was drafted with Claude (Anthropic) assistance. The app itself uses no AI model.
