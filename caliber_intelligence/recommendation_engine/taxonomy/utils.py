from __future__ import annotations

import re
from collections import defaultdict

from recommendation_engine.taxonomy.loader import (
    get_role_families,
    get_role_taxonomy,
    get_skill_taxonomy,
)


WORD_RE = re.compile(r"\b[\w.+#-]+\b", re.IGNORECASE)


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip().lower()


def tokenize(text: str) -> set[str]:
    return {m.group(0).lower() for m in WORD_RE.finditer(text or "")}


def build_skill_alias_map() -> dict[str, str]:
    mapping: dict[str, str] = {}
    for canonical, aliases in get_skill_taxonomy().items():
        mapping[canonical.lower()] = canonical
        for alias in aliases:
            mapping[alias.lower()] = canonical
    return mapping


def extract_skills_from_text(text: str) -> list[str]:
    text_norm = normalize_text(text)
    found: set[str] = set()
    alias_map = build_skill_alias_map()
    for alias, canonical in alias_map.items():
        if re.search(rf"(?<!\w){re.escape(alias)}(?!\w)", text_norm):
            found.add(canonical)
    return sorted(found)


def infer_roles_from_text(text: str) -> list[str]:
    text_norm = normalize_text(text)
    hits: list[str] = []
    for canonical, aliases in get_role_taxonomy().items():
        candidates = [canonical] + aliases
        if any(re.search(rf"(?<!\w){re.escape(item.lower())}(?!\w)", text_norm) for item in candidates):
            hits.append(canonical)
    return sorted(set(hits))


def map_roles_to_families(roles: list[str]) -> list[str]:
    families = get_role_families()
    return sorted({families.get(role, "Unknown") for role in roles})


def weighted_overlap(left: list[str], right: list[str], weights: dict[str, float] | None = None) -> float:
    if not right:
        return 0.0
    left_norm = {x.lower(): x for x in left}
    right_norm = {x.lower(): x for x in right}
    weights = defaultdict(lambda: 1.0, {k.lower(): v for k, v in (weights or {}).items()})
    matched = sum(weights[key] for key in right_norm if key in left_norm)
    total = sum(weights[key] for key in right_norm)
    return matched / total if total else 0.0
