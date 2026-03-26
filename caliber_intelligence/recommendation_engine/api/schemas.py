from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class Seniority(str, Enum):
    internship = "internship"
    entry = "entry"
    junior = "junior"
    mid = "mid"
    senior = "senior"
    unknown = "unknown"


class RemoteType(str, Enum):
    remote = "remote"
    hybrid = "hybrid"
    onsite = "onsite"
    unknown = "unknown"


class EmploymentType(str, Enum):
    internship = "internship"
    full_time = "full_time"
    part_time = "part_time"
    contract = "contract"
    unknown = "unknown"


class InferredRole(BaseModel):
    role: str
    confidence: float = Field(ge=0.0, le=1.0)


class ResumeParseResponse(BaseModel):
    skills: list[str]
    inferred_roles: list[InferredRole]
    seniority: Seniority
    sections: dict[str, str]
    extracted_text_preview: str


class Job(BaseModel):
    job_id: str
    title: str
    role_family: str = "Unknown"
    company: str
    location_city: str | None = None
    location_country: str | None = None
    remote_type: RemoteType = RemoteType.unknown
    employment_type: EmploymentType = EmploymentType.unknown
    seniority: Seniority = Seniority.unknown
    skills: list[str] = Field(default_factory=list)
    description: str = ""
    posted_at: datetime | None = None
    source: str = "unknown"
    salary_min: int | None = None
    salary_max: int | None = None
    is_active: bool = True
    canonical_job_id: str | None = None


class UserBehaviorWeights(BaseModel):
    role_family_weights: dict[str, float] = Field(default_factory=dict)
    skill_weights: dict[str, float] = Field(default_factory=dict)


class UserProfile(BaseModel):
    user_id: str
    preferred_roles: list[str] = Field(default_factory=list)
    preferred_role_families: list[str] = Field(default_factory=list)
    skills: list[str] = Field(default_factory=list)
    preferred_locations: list[str] = Field(default_factory=list)
    remote_preferences: list[RemoteType] = Field(default_factory=list)
    employment_types: list[EmploymentType] = Field(default_factory=list)
    seniority: Seniority = Seniority.unknown
    resume_text: str = ""
    behavior_weights: UserBehaviorWeights = Field(default_factory=UserBehaviorWeights)


class FeatureVector(BaseModel):
    role_score: float
    skill_score: float
    experience_score: float
    location_score: float
    remote_score: float
    freshness_score: float
    behavior_score: float
    source_quality_score: float
    semantic_score: float = 0.0
    extra: dict[str, Any] = Field(default_factory=dict)


class RecommendationExplanation(BaseModel):
    reasons: list[str]


class RecommendationItem(BaseModel):
    job: Job
    score: float
    features: FeatureVector
    explanation: RecommendationExplanation


class RecommendRequest(BaseModel):
    user_profile: UserProfile
    jobs: list[Job]
    top_k: int = Field(default=20, ge=1, le=100)


class RecommendResponse(BaseModel):
    recommendations: list[RecommendationItem]
