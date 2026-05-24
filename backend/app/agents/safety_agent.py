from urllib.parse import urlparse

from app.schemas import AgentResult, InternshipPost, StudentProfile
from app.services.nlp_features import RISK_TERMS, keyword_hits


class SafetyAgent:
    name = "Safety Checker"

    def run(self, internship: InternshipPost, student_profile: StudentProfile | None = None) -> AgentResult:
        text = f"{internship.title} {internship.description} {internship.stipend or ''}"
        warnings: list[str] = []
        evidence: list[str] = []
        score = 82

        risk_hits = keyword_hits(text, RISK_TERMS)
        if risk_hits:
            score -= min(35, len(risk_hits) * 8)
            warnings.append(f"Risky wording found: {', '.join(risk_hits)}")
        else:
            evidence.append("No obvious risky wording found.")

        if internship.stipend and any(term in internship.stipend.lower() for term in ["performance", "commission", "unpaid"]):
            score -= 18
            warnings.append("Pay is not clearly fixed.")
        elif internship.stipend:
            evidence.append("Stipend is stated.")
        else:
            score -= 12
            warnings.append("Stipend is missing.")

        if internship.company_website:
            parsed = urlparse(internship.company_website)
            if parsed.scheme and parsed.netloc:
                evidence.append("Company website is present.")
            else:
                score -= 8
                warnings.append("Company website format looks incomplete.")
        else:
            score -= 10
            warnings.append("Company website is missing.")

        if internship.recruiter_email and internship.recruiter_email.endswith("@gmail.com"):
            score -= 7
            warnings.append("Recruiter email is a free email address; verify the recruiter.")
        elif internship.recruiter_email:
            evidence.append("Recruiter email is present.")
        else:
            score -= 8
            warnings.append("Recruiter contact is missing.")

        score = max(0, min(100, score))
        summary = "Looks reasonably safe." if score >= 70 else "Needs careful verification before applying."
        return AgentResult(agent=self.name, score=score, summary=summary, evidence=evidence, warnings=warnings)
