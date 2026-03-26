from __future__ import annotations

from recommendation_engine.api.schemas import RecommendResponse, RecommendationItem, UserProfile, Job
from recommendation_engine.candidates.candidate_generator import CandidateGenerator
from recommendation_engine.features.builder import FeatureBuilder
from recommendation_engine.ranking.dedup_handler import DedupHandler
from recommendation_engine.ranking.diversity import DiversityReranker
from recommendation_engine.ranking.explain import ExplanationBuilder
from recommendation_engine.ranking.weighted_scorer import WeightedScorer


class RecommendationEngine:
    def __init__(self) -> None:
        self.generator = CandidateGenerator()
        self.feature_builder = FeatureBuilder()
        self.scorer = WeightedScorer()
        self.explainer = ExplanationBuilder()
        self.deduper = DedupHandler()
        self.diversity = DiversityReranker()

    def recommend(self, user: UserProfile, jobs: list[Job], top_k: int = 20) -> RecommendResponse:
        candidates = self.generator.generate(user, jobs)
        items: list[RecommendationItem] = []

        for job in candidates:
            features = self.feature_builder.build(user, job)
            score = self.scorer.score(features)
            explanation = self.explainer.build(user, job, features)
            items.append(
                RecommendationItem(job=job, score=score, features=features, explanation=explanation)
            )

        items.sort(key=lambda item: item.score, reverse=True)
        items = self.deduper.deduplicate(items)
        items = self.diversity.rerank(items, top_k=top_k)
        return RecommendResponse(recommendations=items)
