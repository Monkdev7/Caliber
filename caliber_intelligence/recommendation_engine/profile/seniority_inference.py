from __future__ import annotations

import re

from recommendation_engine.api.schemas import Seniority
from recommendation_engine.taxonomy.loader import get_seniority_keywords


class SeniorityInference:
    def infer(self, sections: dict[str, str]) -> Seniority:
        text = "\n".join(sections.values()).lower()

        if re.search(r"intern(ship)?", text):
            return Seniority.internship

        for level, keywords in get_seniority_keywords().items():
            if any(keyword in text for keyword in keywords):
                return Seniority(level)

        years = self._extract_years(text)
        if years is not None:
            if years <= 1:
                return Seniority.entry
            if years <= 2:
                return Seniority.junior
            if years <= 5:
                return Seniority.mid
            return Seniority.senior

        return Seniority.entry

    def _extract_years(self, text: str) -> int | None:
        match = re.search(r"(\d+)\+?\s+years", text)
        return int(match.group(1)) if match else None
