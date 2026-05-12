# Feature Specification: Recommendation & Ranking System

Summary
- Purpose: Produce a ranked list of loan products tailored to the applicant profile and preferences.
- Audience: Product, frontend, backend, data science.

Goals
- Provide relevance-ranked recommendations with score components (rate, EMI, tenure fit, bank preference).
- Support customizable ranking weights via feature flags and A/B testing.
- Ensure recommendations link back to eligibility and risk signals.

Acceptance Criteria
- API returns ordered `recommendations[]` with `score`, `components`, and `explainability` fields.
- Frontend can request top-N recommendations and receive stable ordering for given inputs.

Notes
- Implement ranking service in `backend/service/RecommendationService` and expose `/api/recommendations`.

References
- Eligibility spec: 01-loan-eligibility.md
