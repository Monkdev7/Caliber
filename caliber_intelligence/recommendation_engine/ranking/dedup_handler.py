from __future__ import annotations

from recommendation_engine.api.schemas import RecommendationItem


class DedupHandler:
    def deduplicate(self, items: list[RecommendationItem]) -> list[RecommendationItem]:
        seen: set[str] = set()
        output: list[RecommendationItem] = []
        for item in items:
            key = item.job.canonical_job_id or f"{item.job.company.lower()}::{item.job.title.lower()}::{item.job.location_city or ''}".lower()
            if key in seen:
                continue
            seen.add(key)
            output.append(item)
        return output
