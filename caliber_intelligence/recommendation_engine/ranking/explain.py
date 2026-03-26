from __future__ import annotations

from recommendation_engine.api.schemas import FeatureVector, Job, RecommendationExplanation, UserProfile


class ExplanationBuilder:
    def build(self, user: UserProfile, job: Job, features: FeatureVector) -> RecommendationExplanation:
        reasons: list[str] = []

        if features.skill_score >= 0.5 and job.skills:
            matched_skills = [skill for skill in job.skills if skill.lower() in {s.lower() for s in user.skills}]
            if matched_skills:
                reasons.append(f"Matches your {', '.join(matched_skills[:3])} skills")

        if features.role_score >= 0.5:
            reasons.append(f"Fits your preferred {job.role_family} roles")

        if features.experience_score >= 0.75:
            reasons.append("Fits your current experience level")

        if features.remote_score >= 1.0:
            reasons.append(f"Matches your {job.remote_type.value} work preference")

        if features.freshness_score >= 0.8:
            reasons.append("Recently posted")

        if not reasons:
            reasons.append("General relevance based on your profile")

        return RecommendationExplanation(reasons=reasons[:4])
