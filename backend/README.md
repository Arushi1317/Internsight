# InternSight Backend

Basic FastAPI backend for the InternSight multi-agent internship review workflow.

## Run locally

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## Main endpoints

- `GET /health` - backend health check
- `GET /api/internships` - sample internship listings
- `POST /api/review` - run the multi-agent review workflow for one internship
- `POST /api/match` - estimate skill match for a resume/profile and internship

The current implementation uses deterministic scoring rules and simple NLP features so the app works without trained model artifacts. The `QualityAgent` is structured so a trained Scikit-learn classifier can be loaded later.
