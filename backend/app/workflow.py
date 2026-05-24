from app.agents import CompetitionAgent, QualityAgent, SafetyAgent, SkillMatchAgent, StrategyAgent
from app.schemas import AgentResult, InternshipPost, ReviewResponse, StudentProfile


class InternshipReviewWorkflow:
    def __init__(self) -> None:
        self.safety_agent = SafetyAgent()
        self.quality_agent = QualityAgent()
        self.match_agent = SkillMatchAgent()
        self.competition_agent = CompetitionAgent()
        self.strategy_agent = StrategyAgent()

    def review(self, internship: InternshipPost, student_profile: StudentProfile | None = None) -> ReviewResponse:
        profile = student_profile or StudentProfile()
        agent_results = [
            self.safety_agent.run(internship, profile),
            self.quality_agent.run(internship, profile),
            self.match_agent.run(internship, profile),
            self.competition_agent.run(internship, profile),
        ]

        overall_score = self._overall_score(agent_results)
        recommendation = self._recommendation(overall_score, agent_results)
        apply_plan = self.strategy_agent.build_plan(internship, profile, agent_results)

        return ReviewResponse(
            internship=internship,
            overall_score=overall_score,
            recommendation=recommendation,
            agents=agent_results,
            apply_plan=apply_plan,
            questions_before_applying=[
                "Is the stipend fixed and written clearly?",
                "Who will mentor or review my work?",
                "What project or deliverable will I complete by the end?",
            ],
        )

    def _overall_score(self, results: list[AgentResult]) -> int:
        scores = {result.agent: result.score for result in results}
        weighted = (
            scores.get("Safety Checker", 0) * 0.3
            + scores.get("Quality Checker", 0) * 0.3
            + scores.get("Skill Match Checker", 0) * 0.25
            + (100 - scores.get("Competition Checker", 0)) * 0.15
        )
        return round(weighted)

    def _recommendation(self, overall_score: int, results: list[AgentResult]) -> str:
        safety = next((result for result in results if result.agent == "Safety Checker"), None)
        if safety and safety.score < 60:
            return "Be careful. Verify this internship before applying."
        if overall_score >= 80:
            return "Strong option. Prepare a tailored application."
        if overall_score >= 65:
            return "Potentially worthwhile. Ask clarifying questions first."
        return "Lower priority. Apply only after checking details."
