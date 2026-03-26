from __future__ import annotations

from recommendation_engine.api.schemas import FeatureVector


DEFAULT_WEIGHTS = {
    "role_score": 0.25,
    "skill_score": 0.25,
    "experience_score": 0.12,
    "location_score": 0.10,
    "remote_score": 0.08,
    "freshness_score": 0.10,
    "behavior_score": 0.08,
    "source_quality_score": 0.02,
    "semantic_score": 0.0,
}


class WeightedScorer:
    def __init__(self, weights: dict[str, float] | None = None) -> None:
        self.weights = weights or DEFAULT_WEIGHTS

    def score(self, features: FeatureVector) -> float:
        total = 0.0
        for key, weight in self.weights.items():
            total += getattr(features, key) * weight
        return round(total, 6)
