from app.schemas import AgentResult, InternshipPost, StudentProfile


class CompetitionAgent:
    name = "Competition Checker"

    def run(self, internship: InternshipPost, student_profile: StudentProfile | None = None) -> AgentResult:
        score = 45
        evidence: list[str] = []
        warnings: list[str] = []

        if internship.deadline_days is not None:
            if internship.deadline_days <= 3:
                score += 25
                warnings.append("Deadline is very close, so urgency is high.")
            elif internship.deadline_days <= 7:
                score += 12
                evidence.append("Deadline is approaching soon.")
            else:
                score -= 5
                evidence.append("There is still time to prepare.")

        if internship.applicant_count is not None:
            if internship.applicant_count >= 100:
                score += 25
                warnings.append("Applicant count looks high.")
            elif internship.applicant_count >= 50:
                score += 12
                evidence.append("Moderate applicant interest.")
            else:
                score -= 8
                evidence.append("Applicant count appears manageable.")

        if internship.mode == "Remote":
            score += 8
            evidence.append("Remote roles often attract a wider applicant pool.")

        score = max(0, min(100, score))
        summary = "Likely competitive or urgent." if score >= 70 else "Competition pressure looks manageable."
        return AgentResult(agent=self.name, score=score, summary=summary, evidence=evidence, warnings=warnings)
