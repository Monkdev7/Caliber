# Caliber Intelligence Engine

A production-oriented starter package for the **resume intelligence** and **job recommendation** layer of Caliber.

## What is included
- PDF resume text extraction with section-aware parsing
- Skill extraction and role inference
- Structured user profile builder
- Candidate generation from normalized jobs
- Feature engineering for ranking
- Weighted scoring and diversity reranking
- Recommendation explanations
- FastAPI service endpoints
- Example taxonomy files and sample payloads

## Suggested integration flow
1. Backend uploads resume and stores the file.
2. This service parses the resume and returns editable profile suggestions.
3. The main backend stores confirmed user preferences.
4. The recommendation endpoint receives a user profile and active jobs.
5. The engine returns ranked recommendations with reasons.

## Install
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run API
```bash
uvicorn recommendation_engine.api.app:app --reload
```

## Run tests
```bash
pytest -q
```

## Main modules
- `profile/`: resume extraction, section parsing, skill extraction, inference
- `candidates/`: candidate generation and hard filters
- `features/`: per-user-per-job feature computation
- `ranking/`: weighted scorer, dedup, diversity, explanations
- `api/`: FastAPI app and request/response schemas

## Important notes
- This is a strong v1 architecture, not the final state.
- Start with rule-based + taxonomy-driven ranking.
- Add embeddings and learning-to-rank after you have real usage data.
