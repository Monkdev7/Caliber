from __future__ import annotations

from datetime import datetime, timedelta, timezone

from recommendation_engine.api.schemas import EmploymentType, Job, RemoteType, Seniority, UserProfile
from recommendation_engine.ranking.ranker import RecommendationEngine


def test_recommendation_engine_orders_relevant_jobs_first() -> None:
    user = UserProfile(
        user_id="u1",
        preferred_roles=["Machine Learning Engineer"],
        preferred_role_families=["Machine Learning / AI"],
        skills=["Python", "PyTorch", "NLP"],
        preferred_locations=["Bengaluru"],
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
            posted_at=datetime.now(timezone.utc) - timedelta(hours=6),
            source="linkedin",
        ),
        Job(
            job_id="j2",
            title="Senior Java Backend Engineer",
            role_family="Backend",
            company="Beta Systems",
            location_city="Pune",
            remote_type=RemoteType.onsite,
            employment_type=EmploymentType.full_time,
            seniority=Seniority.senior,
            skills=["Java", "SQL"],
            posted_at=datetime.now(timezone.utc) - timedelta(days=3),
            source="linkedin",
        ),
    ]

    response = RecommendationEngine().recommend(user, jobs, top_k=5)
    assert response.recommendations
    assert response.recommendations[0].job.job_id == "j1"
