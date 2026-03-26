from __future__ import annotations

from recommendation_engine.api.schemas import UserProfile


def apply_feedback(
    user: UserProfile,
    role_family: str,
    matched_skills: list[str],
    action: str,
) -> UserProfile:
    multiplier = {
        "click": 0.15,
        "save": 0.30,
        "apply": 0.45,
        "ignore": -0.25,
    }.get(action, 0.0)

    current_role_weight = user.behavior_weights.role_family_weights.get(role_family, 0.0)
    user.behavior_weights.role_family_weights[role_family] = round(current_role_weight + multiplier, 3)

    for skill in matched_skills:
        current = user.behavior_weights.skill_weights.get(skill, 0.0)
        user.behavior_weights.skill_weights[skill] = round(current + multiplier, 3)

    return user
