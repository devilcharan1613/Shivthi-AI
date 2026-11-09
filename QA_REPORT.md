# Shivthi AI - Developer QA Review

Review date: 2026-11-09
Repository: https://github.com/devilcharan1613/Shivthi-AI
Scope: Static source review of the current default branch and targeted fixes.

## Findings

### Fixed in this review
1. **AI Core conditional rendering defect (high):** the dashboard matched both Open Source and AI Core before reaching the dedicated AI Core branch. This made the AI Core research-paper panel unreachable. The condition now matches only Open Source, allowing AI Core to render its model feed and research section.
2. **Insufficient API test coverage (medium):** existing tests covered health and query validation only. Added mocked provider tests for GitHub repository mapping, Hugging Face model mapping, and upstream rate-limit propagation. These tests do not call external providers.

### Remaining issues / limitations
1. **No verified build or test run:** GitHub commit status reported no status checks for the reviewed commit. No successful CI result was available during this review. Do not treat the project as build-verified.
2. **Android is a UI prototype only:** it has no API client, navigation, persistence, authentication, or feature parity with the web dashboard.
3. **Android Gradle wrapper is missing:** gradlew, gradlew.bat, and wrapper properties were not present at expected paths. A reproducible command-line APK build cannot be performed from the repository as currently checked.
4. **No Android INTERNET permission:** the current Android UI does not call the API, but this permission will be required when network integration is implemented.
5. **Production API configuration is incomplete:** the web app defaults to http://localhost:8000. A deployed frontend must set NEXT_PUBLIC_API_BASE_URL to the deployed API URL; the API must configure CORS_ORIGINS to include the deployed frontend origin.
6. **No backend integration tests for arXiv XML parsing or federated search:** those paths still need mocked success/error coverage.
7. **No end-to-end/browser tests, accessibility audit, security review, load test, release signing, or deployment verification.**
8. **Domains and Markets are informational placeholders:** no company intelligence or market-price provider is connected. The UI correctly avoids inventing market prices.

## Test plan and result

| Area | Review result |
|---|---|
| FastAPI health and parameter validation | Existing tests retained |
| GitHub response mapping | Mocked test added, execution pending |
| Hugging Face response mapping | Mocked test added, execution pending |
| Upstream rate-limit handling | Mocked test added, execution pending |
| AI Core page rendering | Static defect fixed, browser verification pending |
| Web production build | Not run / not verified |
| Android Gradle build and APK | Blocked by missing Gradle wrapper; not run |
| Live provider connectivity | Not tested |

## Release assessment

**Not production-ready.** The repository contains a web preview, a public-source API, and an Android UI shell. The fixes in this review improve the AI Core UI path and backend test coverage, but no APK or release build can be responsibly supplied until the Gradle wrapper/build configuration is restored and a real build is executed.