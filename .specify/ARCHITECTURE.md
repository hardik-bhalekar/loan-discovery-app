# Architecture Overview: AI-powered Loan Recommendation Platform

This document outlines the high-level components and coordination patterns for the loan-discovery application.

Components
- Frontend (loan/): React/Vite UI that consumes backend APIs and renders recommendations, explainability, and dashboards.
- Backend (backend/): Spring Boot services for auth, profiles, eligibility, recommendations, fraud, compliance and analytics event emission.
- ML Models: Hosted separately (model registry) or embedded as a microservice; versions referenced by predictions.
- Event Pipeline: Lightweight pub/sub (Kafka or cloud pub/sub) or direct DB exports for analytics and model monitoring.
- Agent Integration: `.specify` provides agent commands, prompts, and workflow templates for AI-assisted feature work.

Coordination Patterns
- Synchronous read: eligibility and recommendation APIs should be quick (sub-second); do deterministic checks first, then append ML score.
- Async pipelines: model training, drift detection, and heavy analytics run asynchronously and export dashboards to admin UI.
- Security & Compliance: central policy applied in `ComplianceService` and via request filters for PII handling.
