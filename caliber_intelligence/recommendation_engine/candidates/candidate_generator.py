from __future__ import annotations

from recommendation_engine.api.schemas import Job, UserProfile
from recommendation_engine.candidates.filters import HardFilter
from recommendation_engine.taxonomy.utils import weighted_overlap


class CandidateGenerator:
    def __init__(self) -> None:
        self.hard_filter = HardFilter()

    def generate(self, user: UserProfile, jobs: list[Job], limit: int = 1000) -> list[Job]:
        filtered = [job for job in jobs if self.hard_filter.passes(user, job)]
        scored = []
        for job in filtered:
            pre_score = 0.0
            if job.role_family in user.preferred_role_families:
                pre_score += 0.5
            pre_score += 0.5 * weighted_overlap(user.skills, job.skills)
            scored.append((pre_score, job))
        scored.sort(key=lambda item: item[0], reverse=True)
        return [job for _, job in scored[:limit]]
