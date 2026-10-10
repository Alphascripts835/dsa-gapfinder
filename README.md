
# DSA GapFinder — AI-Powered Coding Weakness Detector

*Find your gaps. Fix your concepts. Crack your next interview.*


**Live website:** https://dsa-gapfinder.vercel.app  
**Backend API:** https://dsa-gapfinder.onrender.com  
**API documentation:** https://dsa-gapfinder.onrender.com/docs

## 1. Problem Statement

**Category:** Open Innovation — Student Pain Points

Students preparing for technical interviews often practise Data Structures and Algorithms (DSA) without knowing which concepts need improvement or what they should practise next.

DSA GapFinder helps learners identify potential weaknesses through a diagnostic assessment, understand their topic-wise performance, and receive focused practice recommendations.

**Target users:** Students preparing for coding tests and technical interviews.

## 2. What the Project Does

DSA GapFinder is a web application that helps students evaluate their DSA practice and identify areas for improvement.

Its main workflow is:

1. Complete a diagnostic assessment.
2. Review topic-wise accuracy and weakness classifications.
3. Explore personalised practice recommendations.
4. Track assessment history and progress.

## 3. Features Implemented

- **Dashboard:** Overview with an empty state and clearly labelled sample demo.
- **Diagnostic assessment:** 30 questions across 10 DSA topics, with three questions per topic.
- **Weakness detection:** Server-side scoring and topic classifications.
- **Weakness explorer:** Sort, filter, and inspect topic-level results.
- **Practice recommendations:** Topic-focused practice cards with completion tracking.
- **Progress analytics:** Assessment history and trends when at least two assessments are saved.
- **DSA doubt chatbot:** Built-in rule-based FAQ responses, with optional AI-generated answers when an Anthropic API key is configured.
- **API tests:** Automated tests for backend functionality.

## 4. Done / Left / Plan

### Done
- Built the React frontend and FastAPI backend.
- Implemented the diagnostic assessment and server-side scoring.
- Added topic-wise weakness analysis and practice recommendations.
- Added progress tracking using browser localStorage.
- Implemented a rule-based chatbot fallback and optional AI integration.
- Deployed the frontend on Vercel and the backend on Render.

### Left
- Expand the question bank beyond three questions per topic.
- Add user accounts and cross-device progress synchronisation.
- Implement and evaluate richer AI-generated explanations.
- Conduct a real student survey and replace placeholder evidence with actual findings.

### Plan
1. Expand the diagnostic question bank.
2. Improve the depth and variety of practice recommendations.
3. Gather real student feedback and evaluate usability.
4. Explore secure user accounts and persistent cloud-based progress.
5. Evaluate optional AI explanations for correctness and usefulness.

## 5. Weakness Detection Algorithm

The weakness detection engine is rule-based and implemented on the backend in `backend/app/analysis.py`.

For each topic:

`Topic accuracy = (Correct answers / Attempted questions) × 100`

The default classifications are:

- **Strong:** 80% or above
- **Developing:** 60% to 79%
- **Needs Improvement:** Below 60%
- **Not Assessed:** No questions attempted for that topic

Thresholds are configurable through `THRESHOLDS`.

Scores are calculated on the server; the frontend does not submit its own calculated scores. The system uses predefined rules rather than a trained AI model.

Because there are only three questions per topic, scores are coarse and should be treated as indicative results rather than proof of mastery.

## 6. Architecture and Design Choices

### Frontend
- React
- Vite
- Recharts
- Lucide icons
- Plain CSS
- Browser localStorage for assessment history and practice completion

### Backend
- Python
- FastAPI
- Pydantic
- Uvicorn
- Pytest for backend testing

### Architecture

The React frontend sends requests to the FastAPI backend. The backend provides questions, evaluates submitted answers, and returns topic-level results and recommendations. The frontend displays those results and stores selected progress data locally in the browser.

**Why this architecture?**
- React supports a responsive, interactive user interface.
- FastAPI provides a lightweight API for assessment and analysis.
- Server-side scoring keeps the analysis logic in one place.
- localStorage enables basic progress tracking without requiring user accounts or a database.

## 7. DSA Doubt Chatbot

The **Ask DSA Doubts** feature supports two modes:

- **Optional AI mode:** When `ANTHROPIC_API_KEY` is configured on the backend, answers are generated using the configured Anthropic model and labelled as AI-generated.
- **Local fallback mode:** Without an API key, a built-in rule-based FAQ provides local notes that are explicitly labelled as not AI-generated.

The application can run without an API key. Chat conversations are not stored.

AI-generated answers may require verification and should not be treated as guaranteed correct.

## 8. How to Run Locally

### Prerequisites
- Python installed
- Node.js and npm installed

### Start the backend

From the project root:

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The backend will be available at `http://localhost:8000`.

### Start the frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

If needed, create `frontend/.env` containing:

```env
VITE_API_URL=http://localhost:8000
```

No API key is required for the basic application or local chatbot fallback.

### Run backend tests

From the project root:

```bash
cd backend
python -m pytest -q
```

## 9. API Endpoints

- `GET /api/health` — backend health check.
- `GET /api/questions` — retrieve questions without exposing correct answers.
- `POST /api/assessments/analyze` — analyse submitted answers using the format `{"answers":{"id":optionIndex}}`.
- `GET /api/recommendations/{topic}` — retrieve recommendations for a topic.

For interactive API documentation, visit `/docs` on the backend.

## 10. Limitations

- Three questions per topic provide only a coarse indication of performance.
- Assessment results do not prove complete understanding or mastery.
- Practice completion is self-reported.
- Progress history is stored in localStorage and is limited to the current browser.
- User accounts and cloud-based progress synchronisation are not implemented.
- Survey evidence is currently placeholder material; no real survey has been conducted.

## 11. Survey Evidence

The `evidence/` directory contains placeholders for future evidence collection. These are not real survey results and should not be interpreted as validated user research.

## 12. Tools and AI Used

- **Frontend:** React, Vite, Recharts, Lucide, CSS.
- **Backend:** Python, FastAPI, Pydantic, Uvicorn.
- **Testing:** Pytest.
- **Deployment:** Vercel for the frontend and Render for the backend.
- **Development assistance:** Claude (Anthropic) assisted with drafting the code.
- **Application AI:** Optional Anthropic integration for chatbot answers; the weakness detection algorithm itself is rule-based.

## 13. Project Links

- **Live application:** https://dsa-gapfinder.vercel.app
- **GitHub repository:** https://github.com/Alphascripts835/dsa-gapfinder
- **Backend health check:** https://dsa-gapfinder.onrender.com/api/health
- **API documentation:** https://dsa-gapfinder.onrender.com/docs


