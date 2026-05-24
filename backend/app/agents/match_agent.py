from app.schemas import AgentResult, InternshipPost, StudentProfile
from app.services.nlp_features import overlap_score


class SkillMatchAgent:
    name = "Skill Match Checker"

    def run(self, internship: InternshipPost, student_profile: StudentProfile | None = None) -> AgentResult:
        profile = student_profile or StudentProfile()
        student_terms = profile.skills + profile.projects + [profile.resume_text]
        role_terms = internship.required_skills + [internship.title, internship.description]
        overlap, matched_terms = overlap_score(student_terms, role_terms)

        score = round(45 + overlap * 0.55)
        evidence: list[str] = []
        warnings: list[str] = []

        if matched_terms:
            evidence.append(f"Matched terms: {', '.join(matched_terms[:10])}")
        else:
            warnings.append("No strong skill overlap found from the current profile.")

        if internship.mode and internship.mode in profile.preferred_modes:
            score += 5
            evidence.append("Work mode matches the student's preference.")

        if internship.location and internship.location in profile.preferred_locations:
            score += 5
            evidence.append("Location matches the student's preference.")

        score = max(0, min(100, score))
        summary = "Strong skill alignment." if score >= 75 else "Some fit, but the student may need to tailor the application."
        return AgentResult(agent=self.name, score=score, summary=summary, evidence=evidence, warnings=warnings)
