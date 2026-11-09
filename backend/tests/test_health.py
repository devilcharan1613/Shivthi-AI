from fastapi.testclient import TestClient
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
