from datetime import datetime, timezone
from typing import Any

import httpx
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    cors_origins: str = "http://localhost:3000"
    github_token: str = ""
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
app = FastAPI(title="Shivthi AI API", version="0.1.0", description="Public-source intelligence API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "shivthi-api", "timestamp": datetime.now(timezone.utc).isoformat()}


@app.get("/api/v1/open-source/trending")
async def trending_repositories(
    language: str | None = Query(default=None, max_length=40),
    limit: int = Query(default=10, ge=1, le=30),
) -> dict[str, Any]:
    """Fetch currently popular repositories from GitHub's public search API."""
    query = "stars:>100 pushed:>2026-01-01"
    if language:
        # GitHub search qualifiers are encoded by the HTTP client.
        query += f" language:{language}"
    headers = {"Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28"}
    if settings.github_token:
        headers["Authorization"] = f"Bearer {settings.github_token}"
    try:
        async with httpx.AsyncClient(timeout=12.0, headers=headers) as client:
            response = await client.get(
                "https://api.github.com/search/repositories",
                params={"q": query, "sort": "stars", "order": "desc", "per_page": limit},
            )
        if response.status_code == 403:
            raise HTTPException(status_code=429, detail="GitHub rate limit reached. Try again later.")
        response.raise_for_status()
        payload = response.json()
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=502, detail="GitHub returned an upstream error.") from exc
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail="Could not reach GitHub.") from exc

    return {
        "source": "GitHub REST API",
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "total_count": payload.get("total_count", 0),
        "items": [
            {
                "name": item["full_name"],
                "description": item.get("description"),
                "url": item["html_url"],
                "stars": item["stargazers_count"],
                "language": item.get("language"),
                "updated_at": item["updated_at"],
            }
            for item in payload.get("items", [])
        ],
    }
