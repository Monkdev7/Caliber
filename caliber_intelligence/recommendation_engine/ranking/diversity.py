from __future__ import annotations

from collections import defaultdict

from recommendation_engine.api.schemas import RecommendationItem


class DiversityReranker:
    def rerank(self, items: list[RecommendationItem], top_k: int) -> list[RecommendationItem]:
        company_counts = defaultdict(int)
        title_counts = defaultdict(int)
        selected: list[RecommendationItem] = []

        for item in items:
            company_key = item.job.company.lower()
            title_key = item.job.title.lower()
            if company_counts[company_key] >= 2:
                continue
            if title_counts[title_key] >= 3:
                continue
            selected.append(item)
            company_counts[company_key] += 1
            title_counts[title_key] += 1
            if len(selected) >= top_k:
                break

        return selected
