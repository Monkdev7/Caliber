from __future__ import annotations

import tempfile
from pathlib import Path

from fastapi import FastAPI, File, Form, UploadFile

from recommendation_engine.api.schemas import RecommendRequest, RecommendResponse, ResumeParseResponse, UserProfile
from recommendation_engine.profile.profile_builder import ResumeProfileBuilder
from recommendation_engine.ranking.ranker import RecommendationEngine

app = FastAPI(title="Caliber Intelligence Engine", version="0.1.0")
profile_builder = ResumeProfileBuilder()
engine = RecommendationEngine()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/parse-resume", response_model=ResumeParseResponse)
async def parse_resume(file: UploadFile = File(...)) -> ResumeParseResponse:
    suffix = Path(file.filename or "resume.pdf").suffix or ".pdf"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp:
        temp.write(await file.read())
        temp_path = temp.name
    return profile_builder.parse_resume(temp_path)


@app.post("/build-profile", response_model=UserProfile)
async def build_profile(user_id: str = Form(...), file: UploadFile = File(...)) -> UserProfile:
    suffix = Path(file.filename or "resume.pdf").suffix or ".pdf"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp:
        temp.write(await file.read())
        temp_path = temp.name
    return profile_builder.build_user_profile(user_id=user_id, file_path=temp_path)


@app.post("/recommend", response_model=RecommendResponse)
def recommend(request: RecommendRequest) -> RecommendResponse:
    return engine.recommend(request.user_profile, request.jobs, top_k=request.top_k)
