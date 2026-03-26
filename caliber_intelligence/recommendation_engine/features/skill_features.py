from __future__ import annotations

from recommendation_engine.api.schemas import Job, UserProfile
from recommendation_engine.taxonomy.utils import weighted_overlap


class SkillFeatures:
    def compute(self, user: UserProfile, job: Job) -> float:
        return weighted_overlap(
            user.skills,
            job.skills,
            weights=user.behavior_weights.skill_weights,
        )
