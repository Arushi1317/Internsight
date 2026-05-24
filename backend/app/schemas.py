from pydantic import BaseModel, Field


class StudentProfile(BaseModel):
    name: str | None = None
    skills: list[str] = Field(default_factory=list)
    projects: list[str] = Field(default_factory=list)
    resume_text: str = ""
    preferred_locations: list[str] = Field(default_factory=list)
    preferred_modes: list[str] = Field(default_factory=list)


class InternshipPost(BaseModel):
    title: str
    company: str
    description: str
    location: str | None = None
    mode: str | None = None
    stipend: str | None = None
    deadline_days: int | None = None
    required_skills: list[str] = Field(default_factory=list)
    recruiter_email: str | None = None
    company_website: str | None = None
    applicant_count: int | None = None


class AgentResult(BaseModel):
    agent: str
    score: int = Field(ge=0, le=100)
    summary: str
    evidence: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)


class ReviewRequest(BaseModel):
    internship: InternshipPost
    student_profile: StudentProfile = Field(default_factory=StudentProfile)


class MatchRequest(BaseModel):
    internship: InternshipPost
    student_profile: StudentProfile


class ReviewResponse(BaseModel):
    internship: InternshipPost
    overall_score: int = Field(ge=0, le=100)
    recommendation: str
    agents: list[AgentResult]
    apply_plan: list[str]
    questions_before_applying: list[str]
