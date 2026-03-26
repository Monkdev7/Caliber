from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

from recommendation_engine.api.schemas import RecommendRequest, UserProfile
from recommendation_engine.profile.profile_builder import ResumeProfileBuilder
from recommendation_engine.ranking.ranker import RecommendationEngine
from recommendation_engine.taxonomy.utils import map_roles_to_families


profile_builder = ResumeProfileBuilder()
engine = RecommendationEngine()


def read_payload() -> dict[str, Any]:
    raw = sys.stdin.read().strip()
    return json.loads(raw) if raw else {}


def write_json(payload: Any) -> None:
    if hasattr(payload, "model_dump"):
        payload = payload.model_dump(mode="json")
    print(json.dumps(payload, ensure_ascii=False))


def analyze_resume(payload: dict[str, Any]) -> dict[str, Any]:
    file_path = payload["file_path"]
    user_id = payload["user_id"]

    parsed = profile_builder.parse_resume(file_path)
    roles = [item.role for item in parsed.inferred_roles]

    profile = UserProfile(
        user_id=user_id,
        preferred_roles=roles,
        preferred_role_families=map_roles_to_families(roles),
        skills=parsed.skills,
        seniority=parsed.seniority,
        resume_text=parsed.extracted_text_preview,
    )

    return {
        "parsed_resume": parsed.model_dump(mode="json"),
        "user_profile": profile.model_dump(mode="json"),
    }


def recommend(payload: dict[str, Any]) -> dict[str, Any]:
    request = RecommendRequest.model_validate(payload)
    response = engine.recommend(
        request.user_profile,
        request.jobs,
        top_k=request.top_k,
    )
    return response.model_dump(mode="json")


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit("Usage: python bridge.py <analyze_resume|recommend>")

    action = sys.argv[1]
    payload = read_payload()

    if action == "analyze_resume":
        write_json(analyze_resume(payload))
        return

    if action == "recommend":
        write_json(recommend(payload))
        return

    raise SystemExit(f"Unsupported action: {action}")


if __name__ == "__main__":
    main()
