from __future__ import annotations

from pathlib import Path

from recommendation_engine.api.schemas import ResumeParseResponse, UserProfile
from recommendation_engine.profile.extractor import ResumeTextExtractor
from recommendation_engine.profile.role_inference import RoleInference
from recommendation_engine.profile.section_parser import SectionParser
from recommendation_engine.profile.seniority_inference import SeniorityInference
from recommendation_engine.profile.skill_extractor import SkillExtractor
from recommendation_engine.taxonomy.utils import map_roles_to_families


class ResumeProfileBuilder:
    def __init__(self) -> None:
        self.extractor = ResumeTextExtractor()
        self.section_parser = SectionParser()
        self.skill_extractor = SkillExtractor()
        self.role_inference = RoleInference()
        self.seniority_inference = SeniorityInference()

    def parse_resume(self, file_path: str | Path) -> ResumeParseResponse:
        raw_text = self.extractor.extract(file_path)
        sections = self.section_parser.parse(raw_text)
        skills = self.skill_extractor.extract(sections)
        inferred_roles = self.role_inference.infer(sections, skills)
        seniority = self.seniority_inference.infer(sections)
        return ResumeParseResponse(
            skills=skills,
            inferred_roles=inferred_roles,
            seniority=seniority,
            sections=sections,
            extracted_text_preview=raw_text[:1000],
        )

    def build_user_profile(self, user_id: str, file_path: str | Path) -> UserProfile:
        parsed = self.parse_resume(file_path)
        roles = [item.role for item in parsed.inferred_roles]
        families = map_roles_to_families(roles)
        return UserProfile(
            user_id=user_id,
            preferred_roles=roles,
            preferred_role_families=families,
            skills=parsed.skills,
            seniority=parsed.seniority,
            resume_text=parsed.extracted_text_preview,
        )
