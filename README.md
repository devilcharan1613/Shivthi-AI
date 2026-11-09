# Shivthi AI

**Global intelligence for technology, research, industries, and markets.**

Shivthi AI is a cross-platform intelligence workspace. This repository contains the web dashboard, Python API, and native Android starter.

## Product areas
- **Command Center:** curated intelligence and briefings.
- **Open Source:** GitHub repositories, releases, and ecosystem signals.
- **AI Core:** models, datasets, papers, and research.
- **Domains:** company and industry intelligence.
- **Markets:** market overview and economic indicators.

## Architecture
- Web: Next.js App Router + TypeScript
- API: FastAPI + Pydantic
- Android: Kotlin + Jetpack Compose
- Integrations: GitHub, arXiv, Hugging Face, SEC EDGAR, FRED, GDELT
- Storage: PostgreSQL planned; provider adapters are isolated from UI

## Run locally

### Web
```bash
cd apps/web
npm install
npm run dev
```
Open http://localhost:3000.

### API
```bash
cd backend
python -m venv .venv
# activate the virtual environment
pip install -r requirements.txt
uvicorn app.main:app --reload
```
API docs: http://127.0.0.1:8000/docs

### Android
Open `apps/android` in Android Studio and allow Gradle sync. The Android project is an initial native shell; feature parity and release signing are future milestones.

## Data integrity
- Demo dashboard figures are explicitly labelled **sample/demo**, never represented as live market data.
- Every live integration should display provider, retrieval time, and freshness.
- Provider failures and rate limits must be visible; no silent fabricated fallbacks.
- API keys belong in environment variables or a secret manager, never in source control.

## Current status
Milestone 2 (in progress): live GitHub repository discovery, Hugging Face model discovery, and arXiv paper search APIs are implemented; the web dashboard consumes GitHub and Hugging Face feeds and can load arXiv papers. Android remains a UI starter.
Not yet production-ready. Authentication, persistent database, background ingestion, live market feeds, alerting, deployment, and full QA remain planned. External API availability and rate limits apply.

## Roadmap
1. Foundation and design system
2. Dashboard and module navigation
3. API and source adapters
4. Research and open-source discovery
5. Market data with licensing/freshness controls
6. AI briefings with citations
7. Android feature implementation
8. Authentication, watchlists, alerts, security, and release QA

## License
No license has been granted yet. All rights reserved unless a license is added by the repository owner.
