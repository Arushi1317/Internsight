from app.schemas import InternshipPost

SAMPLE_INTERNSHIPS = [
    InternshipPost(
        title="NLP Product Analyst Intern",
        company="BrightForge Labs",
        description=(
            "Build text-quality features, review labeled internship posts, and turn model findings "
            "into product decisions with weekly mentorship."
        ),
        location="Bengaluru",
        mode="Hybrid",
        stipend="Rs 28k/mo",
        deadline_days=4,
        required_skills=["Python", "NLP", "SQL", "Product thinking"],
        recruiter_email="careers@brightforge.example",
        company_website="https://brightforge.example",
        applicant_count=84,
    ),
    InternshipPost(
        title="Growth AI Intern",
        company="Moonlit Metrics",
        description=(
            "Use AI tools for content, campaign support, lead generation, and other tasks as needed. "
            "Fast selection process with performance-based pay."
        ),
        location="Delhi NCR",
        mode="Onsite",
        stipend="Performance based",
        deadline_days=2,
        required_skills=["AI tools", "Content", "Outreach"],
        recruiter_email="moonlitmetrics@gmail.com",
        company_website=None,
        applicant_count=36,
    ),
]
