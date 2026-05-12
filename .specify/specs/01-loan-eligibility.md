# Feature Specification: Loan Eligibility Engine

Summary
- Purpose: Determine borrower eligibility using deterministic rules and ML-assisted signals.
- Audience: Product managers, backend engineers, data scientists, compliance.

Goals
- Accurately classify applicants into eligibility buckets (Eligible, Conditionally Eligible, Not Eligible).
- Provide clear, auditable decision reasons for each outcome.
- Support both rule-based checks (KYC, minimum income, debt-to-income) and ML scoring signals.

Acceptance Criteria
- API returns `eligibility` and `reasons` fields for every request.
- Rule violations are listed with rule id and human-readable text.
- ML score is provided as a numeric value with model version metadata.

Notes
- Place decision logic inside `backend/service/ScoringEngine` and expose via `/api/prediction/eligibility`.
- Keep explainability metadata small (max 1-2KB) to avoid payload bloat.

References
- Compliance spec: ../03-bfsi-compliance.md
