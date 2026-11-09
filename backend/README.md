# Shivthi AI API

FastAPI service for source-attributed public intelligence.

## Start locally
```bash
cd backend
python -m venv .venv
# activate the environment
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Interactive API docs: http://127.0.0.1:8000/docs

## Endpoints

| Method | Endpoint | Provider |
|---|---|---|
| GET | `/health` | Shivthi API |
| GET | `/api/v1/open-source/trending?limit=10&q=react` | GitHub REST API |
| GET | `/api/v1/ai/models?limit=10&q=llama` | Hugging Face Hub |
| GET | `/api/v1/research/papers?q=machine%20learning` | arXiv API |
| GET | `/api/v1/search?q=vector%20database` | GitHub + Hugging Face |

Every data response includes a provider name and UTC retrieval timestamp. Upstream failures are returned as explicit HTTP errors. Providers may rate-limit unauthenticated traffic.

## Optional environment
Set `GITHUB_TOKEN` to increase GitHub API rate limits. Set `CORS_ORIGINS` to a comma-separated list of trusted frontend origins. Never commit real tokens.
