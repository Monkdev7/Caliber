from __future__ import annotations

from recommendation_engine.api.schemas import Job, Seniority, UserProfile


ORDER = {
    Seniority.internship: 0,
    Seniority.entry: 1,
    Seniority.junior: 2,
    Seniority.mid: 3,
    Seniority.senior: 4,
    Seniority.unknown: 2,
}


class ExperienceFeatures:
    def compute(self, user: UserProfile, job: Job) -> float:
        gap = abs(ORDER[user.seniority] - ORDER[job.seniority])
        return max(0.0, 1.0 - 0.25 * gap)
