from datetime import datetime, timezone
from typing import Any
from xml.etree import ElementTree

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
app = FastAPI(title="Shivthi AI API", version="0.2.0", description="Source-attributed public intelligence API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


def metadata(source: str) -> dict[str, str]:
    return {"source": source, "fetched_at": datetime.now(timezone.utc).isoformat()}


async def get_json(url: str, *, params: dict[str, Any] | None = None, headers: dict[str, str] | None = None) -> Any:
    try:
        async with httpx.AsyncClient(timeout=18.0, follow_redirects=True) as client:
            response = await client.get(url, params=params, headers=headers)
        if response.status_code == 429:
            raise HTTPException(status_code=429, detail="The source rate limit was reached. Try again shortly.")
        response.raise_for_status()
        return response.json()
    except HTTPException:
        raise
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=502, detail="The upstream data provider returned an error.") from exc
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail="Could not connect to the upstream data provider.") from exc


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "shivthi-api", "timestamp": datetime.now(timezone.utc).isoformat()}


@app.get("/api/v1/open-source/trending")
async def trending_repositories(
    language: str | None = Query(default=None, max_length=40),
    q: str | None = Query(default=None, max_length=100),
    limit: int = Query(default=10, ge=1, le=30),
) -> dict[str, Any]:
    search = (q or "").strip()
    query = f"{search} " if search else ""
    query += "stars:>100"
    if language and language.lower() != "all":
        if not language.replace("-", "").replace("+", "").isalnum():
            raise HTTPException(status_code=422, detail="Invalid language filter.")
        query += f" language:{language}"
    headers = {"Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28"}
    if settings.github_token:
        headers["Authorization"] = f"Bearer {settings.github_token}"
    payload = await get_json(
        "https://api.github.com/search/repositories",
        params={"q": query, "sort": "stars", "order": "desc", "per_page": limit},
        headers=headers,
    )
    return {
        **metadata("GitHub REST API"),
        "total_count": payload.get("total_count", 0),
        "items": [{
            "name": item["full_name"], "description": item.get("description"),
            "url": item["html_url"], "stars": item["stargazers_count"],
            "language": item.get("language"), "updated_at": item["updated_at"],
        } for item in payload.get("items", [])],
    }


@app.get("/api/v1/ai/models")
async def popular_models(
    q: str | None = Query(default=None, max_length=100),
    limit: int = Query(default=10, ge=1, le=30),
) -> dict[str, Any]:
    params: dict[str, Any] = {"sort": "downloads", "direction": "-1", "limit": limit}
    if q and q.strip():
        params["search"] = q.strip()
    payload = await get_json("https://huggingface.co/api/models", params=params)
    return {
        **metadata("Hugging Face Hub API"),
        "items": [{
            "id": item.get("modelId") or item.get("id"),
            "url": "https://huggingface.co/" + (item.get("modelId") or item.get("id", "")),
            "downloads": item.get("downloads", 0),
            "likes": item.get("likes", 0),
            "pipeline_tag": item.get("pipeline_tag"),
            "last_modified": item.get("lastModified"),
        } for item in payload],
    }


@app.get("/api/v1/research/papers")
async def research_papers(
    q: str = Query(default="artificial intelligence", min_length=2, max_length=120),
    limit: int = Query(default=10, ge=1, le=20),
) -> dict[str, Any]:
    try:
        async with httpx.AsyncClient(timeout=20.0, follow_redirects=True) as client:
            response = await client.get(
                "https://export.arxiv.org/api/query",
                params={"search_query": f"all:{q}", "start": 0, "max_results": limit, "sortBy": "submittedDate", "sortOrder": "descending"},
                headers={"User-Agent": "ShivthiAI/0.2 (public research discovery)"},
            )
        response.raise_for_status()
        root = ElementTree.fromstring(response.text)
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=502, detail="arXiv returned an upstream error.") from exc
    except (httpx.RequestError, ElementTree.ParseError) as exc:
        raise HTTPException(status_code=502, detail="Could not retrieve or parse arXiv results.") from exc

    ns = {"a": "http://www.w3.org/2005/Atom"}
    items = []
    for entry in root.findall("a:entry", ns):
        link = entry.find("a:id", ns)
        title = entry.find("a:title", ns)
        summary = entry.find("a:summary", ns)
        published = entry.find("a:published", ns)
        authors = [node.text for node in entry.findall("a:author/a:name", ns) if node.text]
        items.append({
            "title": " ".join((title.text or "").split()) if title is not None else "Untitled paper",
            "summary": " ".join((summary.text or "").split()) if summary is not None else "",
            "url": link.text if link is not None else "",
            "published": published.text if published is not None else None,
            "authors": authors[:5],
        })
    return {**metadata("arXiv API"), "items": items}


@app.get("/api/v1/search")
async def unified_search(q: str = Query(min_length=2, max_length=100)) -> dict[str, Any]:
    """Lightweight federated search over public GitHub repositories and Hugging Face models."""
    repositories, models = await __import__("asyncio").gather(
        trending_repositories(q=q, limit=5),
        popular_models(q=q, limit=5),
    )
    return {"query": q, "fetched_at": datetime.now(timezone.utc).isoformat(),
            "repositories": repositories["items"], "models": models["items"]}
