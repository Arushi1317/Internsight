from app.sample_data import SAMPLE_INTERNSHIPS
from app.schemas import StudentProfile
from app.workflow import InternshipReviewWorkflow


def main() -> None:
    workflow = InternshipReviewWorkflow()
    profile = StudentProfile(
        skills=["Python", "NLP", "SQL", "FastAPI", "dashboard"],
        projects=["Built an internship quality classifier using NLP"],
        preferred_locations=["Bengaluru"],
        preferred_modes=["Hybrid", "Remote"],
    )
    result = workflow.review(SAMPLE_INTERNSHIPS[0], profile)
    print(result.model_dump_json(indent=2))


if __name__ == "__main__":
    main()
