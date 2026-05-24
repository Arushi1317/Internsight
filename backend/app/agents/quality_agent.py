from app.schemas import AgentResult, InternshipPost, StudentProfile
from app.services.nlp_features import QUALITY_TERMS, keyword_hits, top_terms


class QualityAgent:
    name = "Quality Checker"

    def run(self, internship: InternshipPost, student_profile: StudentProfile | None = None) -> AgentResult:
        text = f"{internship.title} {internship.description}"
        quality_hits = keyword_hits(text, QUALITY_TERMS)
        evidence: list[str] = []
        warnings: list[str] = []
        score = 55 + min(35, len(quality_hits) * 7)

        if quality_hits:
            evidence.append(f"Learning/value signals found: {', '.join(quality_hits)}")
        else:
            warnings.append("The description does not clearly mention mentorship, deliverables, or learning outcomes.")

        if len(internship.description.split()) >= 25:
            score += 7
            evidence.append("Role description has enough detail to review.")
        else:
            score -= 10
            warnings.append("Role description is short or vague.")

        if internship.required_skills:
            score += 5
            evidence.append("Required skills are listed.")
        else:
            score -= 6
            warnings.append("Required skills are not listed.")

        terms = top_terms(text, limit=5)
        if terms:
            evidence.append(f"Important role terms: {', '.join(terms)}")

        score = max(0, min(100, score))
        summary = "Likely useful for learning and portfolio growth." if score >= 75 else "Quality is mixed; ask for clearer work details."
        return AgentResult(agent=self.name, score=score, summary=summary, evidence=evidence, warnings=warnings)
