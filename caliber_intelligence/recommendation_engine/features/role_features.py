from __future__ import annotations

from difflib import SequenceMatcher

from recommendation_engine.api.schemas import Job, UserProfile


def token_sort_ratio(left: str, right: str) -> float:
    left_normalized = " ".join(sorted(left.split()))
    right_normalized = " ".join(sorted(right.split()))
    return SequenceMatcher(None, left_normalized, right_normalized).ratio()


class RoleFeatures:
    def compute(self, user: UserProfile, job: Job) -> float:
        score = 0.0
        title = job.title.lower()

        if job.role_family in user.preferred_role_families:
            score += 0.55

        if user.preferred_roles:
            best = max(
                token_sort_ratio(title, role.lower())
                for role in user.preferred_roles
            )
            score += 0.45 * best

        return min(score, 1.0)
