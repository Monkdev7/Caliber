from __future__ import annotations

from datetime import datetime, timezone

from recommendation_engine.api.schemas import Job


class FreshnessFeatures:
    def compute(self, job: Job) -> float:
        if not job.posted_at:
            return 0.3
        now = datetime.now(timezone.utc)
        posted = job.posted_at if job.posted_at.tzinfo else job.posted_at.replace(tzinfo=timezone.utc)
        age_hours = (now - posted).total_seconds() / 3600
        if age_hours <= 24:
            return 1.0
        if age_hours <= 72:
            return 0.8
        if age_hours <= 24 * 7:
            return 0.55
        if age_hours <= 24 * 14:
            return 0.3
        return 0.1
