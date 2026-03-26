from __future__ import annotations

from recommendation_engine.taxonomy.utils import extract_skills_from_text


class SkillExtractor:
    def extract(self, sections: dict[str, str]) -> list[str]:
        weighted_text = []
        if skills_text := sections.get("skills"):
            weighted_text.append(skills_text)
            weighted_text.append(skills_text)
        if projects_text := sections.get("projects"):
            weighted_text.append(projects_text)
        if experience_text := sections.get("experience"):
            weighted_text.append(experience_text)
        if summary_text := sections.get("summary"):
            weighted_text.append(summary_text)
        return extract_skills_from_text("\n".join(weighted_text))
