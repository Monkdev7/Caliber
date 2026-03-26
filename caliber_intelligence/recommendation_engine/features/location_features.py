from __future__ import annotations

from recommendation_engine.api.schemas import Job, RemoteType, UserProfile


class LocationFeatures:
    def compute_location(self, user: UserProfile, job: Job) -> float:
        if not user.preferred_locations:
            return 0.5
        if job.remote_type == RemoteType.remote:
            return 0.8
        if job.location_city and job.location_city.lower() in {loc.lower() for loc in user.preferred_locations}:
            return 1.0
        return 0.0

    def compute_remote(self, user: UserProfile, job: Job) -> float:
        if not user.remote_preferences:
            return 0.5
        return 1.0 if job.remote_type in user.remote_preferences else 0.0
