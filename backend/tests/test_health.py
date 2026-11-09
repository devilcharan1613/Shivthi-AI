from fastapi.testclient import TestClient

from app import main
from app.main import app

client = TestClient(app)


def test_health_returns_ok():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_github_limit_is_validated():
    response = client.get("/api/v1/open-source/trending?limit=100")
    assert response.status_code == 422


def test_model_limit_is_validated():
    response = client.get("/api/v1/ai/models?limit=0")
    assert response.status_code == 422


def test_research_query_is_required_to_be_long_enough():
    response = client.get("/api/v1/research/papers?q=a")
    assert response.status_code == 422


def test_trending_repositories_maps_provider_payload(monkeypatch):
    async def fake_get_json(url, *, params=None, headers=None):
        assert url.endswith("/search/repositories")
        assert params["per_page"] == 2
        return {"total_count": 1, "items": [{
            "full_name": "octo/example", "description": "Example project",
            "html_url": "https://github.com/octo/example", "stargazers_count": 123,
            "language": "Python", "updated_at": "2026-11-08T10:00:00Z",
        }]}

    monkeypatch.setattr(main, "get_json", fake_get_json)
    response = client.get("/api/v1/open-source/trending?limit=2")
    assert response.status_code == 200
    payload = response.json()
    assert payload["source"] == "GitHub REST API"
    assert payload["items"][0]["name"] == "octo/example"
    assert payload["items"][0]["stars"] == 123


def test_models_maps_provider_payload(monkeypatch):
    async def fake_get_json(url, *, params=None, headers=None):
        assert url == "https://huggingface.co/api/models"
        return [{"modelId": "org/model", "downloads": 42, "likes": 7,
                 "pipeline_tag": "text-generation", "lastModified": "2026-11-08T10:00:00Z"}]

    monkeypatch.setattr(main, "get_json", fake_get_json)
    response = client.get("/api/v1/ai/models")
    assert response.status_code == 200
    item = response.json()["items"][0]
    assert item["id"] == "org/model"
    assert item["downloads"] == 42
    assert item["url"] == "https://huggingface.co/org/model"


def test_upstream_rate_limit_is_returned_as_429(monkeypatch):
    from fastapi import HTTPException

    async def fake_get_json(url, *, params=None, headers=None):
        raise HTTPException(status_code=429, detail="Rate limited")

    monkeypatch.setattr(main, "get_json", fake_get_json)
    response = client.get("/api/v1/ai/models")
    assert response.status_code == 429
