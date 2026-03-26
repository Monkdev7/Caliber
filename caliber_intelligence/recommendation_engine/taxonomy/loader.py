from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

from recommendation_engine.config import TAXONOMY_DIR


def _load_json(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


@lru_cache(maxsize=1)
def get_skill_taxonomy() -> dict[str, list[str]]:
    return _load_json(TAXONOMY_DIR / "skills.json")


@lru_cache(maxsize=1)
def get_role_taxonomy() -> dict[str, list[str]]:
    return _load_json(TAXONOMY_DIR / "roles.json")


@lru_cache(maxsize=1)
def get_role_families() -> dict[str, str]:
    return _load_json(TAXONOMY_DIR / "role_families.json")


@lru_cache(maxsize=1)
def get_seniority_keywords() -> dict[str, list[str]]:
    return _load_json(TAXONOMY_DIR / "seniority.json")
