from __future__ import annotations

from datetime import datetime, timedelta, timezone

from recommendation_engine.api.schemas import EmploymentType, Job, RemoteType, Seniority, UserProfile
from recommendation_engine.ranking.ranker import RecommendationEngine

user = UserProfile(
    user_id="u_demo",
    preferred_roles=["Machine Learning Engineer"],
    preferred_role_families=["Machine Learning / AI"],
    skills=["Python", "PyTorch", "NLP"],
    preferred_locations=["Bengaluru", "Remote"],
    remote_preferences=[RemoteType.remote, RemoteType.hybrid],
    employment_types=[EmploymentType.internship, EmploymentType.full_time],
    seniority=Seniority.entry,
)

jobs = [
    Job(
        job_id="j1",
        title="AI/ML Intern",
        role_family="Machine Learning / AI",
        company="Alpha Labs",
        location_city="Bengaluru",
        remote_type=RemoteType.hybrid,
        employment_type=EmploymentType.internship,
        seniority=Seniority.internship,
        skills=["Python", "PyTorch", "NLP"],
        description="Build NLP and model serving pipelines.",
        posted_at=datetime.now(timezone.utc) - timedelta(hours=10),
        source="linkedin",
    ),
    Job(
        job_id="j2",
        title="Frontend Developer",
        role_family="Frontend",
        company="UI Forge",
        location_city="Mumbai",
        remote_type=RemoteType.onsite,
        employment_type=EmploymentType.full_time,
        seniority=Seniority.entry,
        skills=["JavaScript", "React"],
        description="React and TypeScript UI work.",
        posted_at=datetime.now(timezone.utc) - timedelta(hours=4),
        source="naukri",
    ),
]

response = RecommendationEngine().recommend(user, jobs)
for idx, item in enumerate(response.recommendations, start=1):
    print(f"{idx}. {item.job.title} @ {item.job.company} | score={item.score}")
    print(f"   reasons: {item.explanation.reasons}")
