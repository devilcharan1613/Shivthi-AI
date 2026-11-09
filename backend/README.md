# Shivthi AI API

FastAPI service for source-attributed intelligence data.

## Start
```bash
python -m venv .venv
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Endpoints
- `GET /health`
- `GET /api/v1/open-source/trending?language=python&limit=10`

The GitHub endpoint queries GitHub's public REST API. Unauthenticated requests are rate-limited; configure `GITHUB_TOKEN` in the environment for a higher limit. Never commit a real token.
