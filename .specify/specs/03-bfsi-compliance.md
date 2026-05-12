# Feature Specification: BFSI Compliance Considerations

Summary
- Purpose: Capture regulatory, data-retention, audit, and consent requirements for loan workflows.

Key Points
- Data minimization: store only required PII and retention windows per jurisdiction.
- Audit trail: persist decision logs with timestamps, actor, model version, and inputs (redact sensitive fields).
- Consent: record user consent receipts for any profiling/ML operations.
- Explainability: provide human-readable reasons for decisions where required.

Acceptance Criteria
- Compliance checklist included in feature PRs.
- Decision logs stored in `StatementReport` or a dedicated `DecisionLog` table with TTL and export tools.

Notes
- Coordinate with legal/compliance teams for jurisdiction-specific policies.
