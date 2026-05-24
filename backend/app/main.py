from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.sample_data import SAMPLE_INTERNSHIPS
from app.schemas import InternshipPost, MatchRequest, ReviewRequest, ReviewResponse
from app.workflow import InternshipReviewWorkflow

app = FastAPI(
    title="InternSight API",
    description="Internship safety, quality, skill-match, competition, and apply-plan API.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5174", "http://localhost:5174", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

workflow = InternshipReviewWorkflow()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "internsight-api"}


@app.get("/api/internships", response_model=list[InternshipPost])
def list_internships() -> list[InternshipPost]:
    return SAMPLE_INTERNSHIPS


@app.post("/api/review", response_model=ReviewResponse)
def review_internship(request: ReviewRequest) -> ReviewResponse:
    return workflow.review(request.internship, request.student_profile)


@app.post("/api/match")
def match_internship(request: MatchRequest) -> dict[str, object]:
    result = workflow.match_agent.run(request.internship, request.student_profile)
    return {
        "score": result.score,
        "summary": result.summary,
        "evidence": result.evidence,
    }
