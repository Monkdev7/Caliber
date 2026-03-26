from __future__ import annotations

from recommendation_engine.api.schemas import Job, UserProfile


class HardFilter:
    def passes(self, user: UserProfile, job: Job) -> bool:
        if not job.is_active:
            return False

        if user.employment_types and job.employment_type not in user.employment_types:
            return False

        if user.remote_preferences and job.remote_type not in user.remote_preferences:
            if job.remote_type.value != "unknown":
                return False

        if user.preferred_role_families:
            if job.role_family not in user.preferred_role_families and job.role_family != "Unknown":
                return False

        if user.seniority.value in {"internship", "entry"} and job.seniority.value in {"mid", "senior"}:
            return False

        if user.preferred_locations and job.location_city:
            allowed = {loc.lower() for loc in user.preferred_locations}
            if job.location_city.lower() not in allowed and job.remote_type.value == "onsite":
                return False

        return True
