from __future__ import annotations

from recommendation_engine.api.schemas import FeatureVector, Job, UserProfile
from recommendation_engine.features.behavior_features import BehaviorFeatures
from recommendation_engine.features.experience_features import ExperienceFeatures
from recommendation_engine.features.freshness_features import FreshnessFeatures
from recommendation_engine.features.location_features import LocationFeatures
from recommendation_engine.features.role_features import RoleFeatures
from recommendation_engine.features.skill_features import SkillFeatures
from recommendation_engine.features.source_quality_features import SourceQualityFeatures


class FeatureBuilder:
    def __init__(self) -> None:
        self.role = RoleFeatures()
        self.skill = SkillFeatures()
        self.experience = ExperienceFeatures()
        self.location = LocationFeatures()
        self.freshness = FreshnessFeatures()
        self.behavior = BehaviorFeatures()
        self.source_quality = SourceQualityFeatures()

    def build(self, user: UserProfile, job: Job) -> FeatureVector:
        return FeatureVector(
            role_score=self.role.compute(user, job),
            skill_score=self.skill.compute(user, job),
            experience_score=self.experience.compute(user, job),
            location_score=self.location.compute_location(user, job),
            remote_score=self.location.compute_remote(user, job),
            freshness_score=self.freshness.compute(job),
            behavior_score=self.behavior.compute(user, job),
            source_quality_score=self.source_quality.compute(job),
            semantic_score=0.0,
            extra={"role_family": job.role_family},
        )
