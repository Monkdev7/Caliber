from __future__ import annotations

from collections import Counter

from recommendation_engine.api.schemas import InferredRole
from recommendation_engine.taxonomy.loader import get_role_taxonomy
from recommendation_engine.taxonomy.utils import infer_roles_from_text


class RoleInference:
    def infer(self, sections: dict[str, str], skills: list[str]) -> list[InferredRole]:
        score = Counter()
        joined = "\n".join(sections.values())

        for role in infer_roles_from_text(joined):
            score[role] += 3

        skill_set = {skill.lower() for skill in skills}
        if {"react", "javascript", "typescript"} & skill_set:
            score["Frontend Developer"] += 2
        if {"django", "fastapi", "flask", "postgresql", "sql"} & skill_set:
            score["Backend Developer"] += 2
        if {"pytorch", "tensorflow", "scikit-learn", "nlp", "computer vision", "llm"} & skill_set:
            score["Machine Learning Engineer"] += 3
        if {"pandas", "sql", "numpy"} & skill_set:
            score["Data Analyst"] += 1
            score["Data Scientist"] += 1
        if {"docker", "kubernetes", "aws"} & skill_set:
            score["DevOps Engineer"] += 2

        if not score:
            score["Software Engineer"] = 1

        total = sum(score.values()) or 1
        inferred = [
            InferredRole(role=role, confidence=round(value / total, 3))
            for role, value in score.most_common(4)
        ]
        return inferred
