from __future__ import annotations

import re
from collections import OrderedDict

SECTION_PATTERNS = OrderedDict(
    [
        ("summary", [r"summary", r"professional summary", r"profile"]),
        ("skills", [r"skills", r"technical skills", r"core competencies"]),
        ("experience", [r"experience", r"work experience", r"employment"]),
        ("projects", [r"projects", r"personal projects", r"academic projects"]),
        ("education", [r"education", r"academic background"]),
        ("certifications", [r"certifications", r"licenses"]),
    ]
)


class SectionParser:
    def parse(self, text: str) -> dict[str, str]:
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        sections: dict[str, list[str]] = {name: [] for name in SECTION_PATTERNS}
        current = "summary"

        for line in lines:
            normalized = line.lower().strip(":")
            found = self._match_heading(normalized)
            if found:
                current = found
                continue
            sections.setdefault(current, []).append(line)

        return {k: "\n".join(v).strip() for k, v in sections.items() if any(v)}

    def _match_heading(self, line: str) -> str | None:
        compact = re.sub(r"\s+", " ", line)
        for section, patterns in SECTION_PATTERNS.items():
            if any(re.fullmatch(pattern, compact) for pattern in patterns):
                return section
        return None
