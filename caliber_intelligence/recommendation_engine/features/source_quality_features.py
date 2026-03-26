from __future__ import annotations

from recommendation_engine.api.schemas import Job


SOURCE_PRIORS = {
    "linkedin": 0.9,
    "naukri": 0.85,
    "indeed": 0.82,
    "internshala": 0.84,
}


class SourceQualityFeatures:
    def compute(self, job: Job) -> float:
        return SOURCE_PRIORS.get(job.source.lower(), 0.65)
