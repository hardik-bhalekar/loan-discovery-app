package com.loandiscovery.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Outbound response for prediction endpoints.
 * <p>
 * Only safe, non-PII data is included.
 * The breakdown allows the client to render scoring factor details.
 */
public record PredictionResponse(
        Long decisionId,
        String idempotencyKey,
        int riskScore,
        String riskBand,
        boolean eligible,
        String eligibilityReason,
        BigDecimal maxEligibleAmount,
        BigDecimal recommendedEmi,
        Breakdown breakdown,
        LocalDateTime decidedAt
) {

    /**
     * Individual scoring factor weights that contributed to the final risk score.
     */
    public record Breakdown(
            int creditScoreWeight,
            int dtiWeight,
            int incomeStabilityWeight,
            int tenureWeight,
            int loanTypeWeight
    ) {}
}
