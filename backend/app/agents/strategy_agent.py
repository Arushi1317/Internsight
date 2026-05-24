from app.schemas import AgentResult, InternshipPost, StudentProfile


class StrategyAgent:
    name = "Apply Plan Generator"

    def build_plan(self, internship: InternshipPost, student_profile: StudentProfile, agent_results: list[AgentResult]) -> list[str]:
        plan = [
            "Tailor the resume summary to the internship title and top required skills.",
            "Add one project bullet that proves relevant experience.",
            "Prepare two questions about mentorship, stipend, and final deliverables.",
        ]

        safety = next((result for result in agent_results if result.agent == "Safety Checker"), None)
        match = next((result for result in agent_results if result.agent == "Skill Match Checker"), None)

        if safety and safety.score < 70:
            plan.insert(0, "Verify the recruiter, stipend, and company website before sharing personal documents.")

        if match and match.score < 70:
            plan.append("Spend 30 minutes mapping your strongest project to the role requirements before applying.")

        if internship.deadline_days is not None and internship.deadline_days <= 3:
            plan.append("Apply soon, but send a short follow-up message with one specific reason you fit the role.")

        return plan

    def run(self, internship: InternshipPost, student_profile: StudentProfile | None = None) -> AgentResult:
        profile = student_profile or StudentProfile()
        plan = self.build_plan(internship, profile, [])
        return AgentResult(agent=self.name, score=80, summary="Application plan generated.", evidence=plan)
