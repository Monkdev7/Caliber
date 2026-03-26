from __future__ import annotations

from recommendation_engine.api.schemas import Job, UserProfile


class BehaviorFeatures:
    def compute(self, user: UserProfile, job: Job) -> float:
        role_weight = user.behavior_weights.role_family_weights.get(job.role_family, 0.0)
        skill_boosts = [user.behavior_weights.skill_weights.get(skill, 0.0) for skill in job.skills]
        skill_weight = sum(skill_boosts) / len(skill_boosts) if skill_boosts else 0.0
        return min(1.0, max(0.0, 0.6 * role_weight + 0.4 * skill_weight))
