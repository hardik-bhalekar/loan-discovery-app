package com.loandiscovery.service;

import com.loandiscovery.dto.PredictionRequest;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ScoringEngineTest {

    private final ScoringEngine scoringEngine = new ScoringEngine();

    private PredictionRequest createBaseRequest() {
        PredictionRequest req = new PredictionRequest();
        req.setIdempotencyKey("test-key-12345678");
        req.setMonthlyIncome(new BigDecimal("100000.00"));
        req.setCreditScore(800);
        req.setExistingEmi(new BigDecimal("10000.00"));
        req.setLoanAmount(new BigDecimal("500000.00"));
        req.setLoanType("Home Loan");
        req.setTenure(120);
        return req;
    }

    @Test
    void testScore_excellentProfile() {
        PredictionRequest req = createBaseRequest();
        var result = scoringEngine.score(req);

        assertTrue(result.eligible(), "Should be eligible");
        assertTrue(result.riskScore() <= 20, "Risk score should be low");
        assertEquals("LOW", result.riskBand());
        assertTrue(result.maxEligibleAmount().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    void testScore_poorCreditScore() {
        PredictionRequest req = createBaseRequest();
        req.setCreditScore(400); // Below threshold of 500

        var result = scoringEngine.score(req);
        assertFalse(result.eligible(), "Should not be eligible");
        assertEquals("Credit score below minimum threshold of 500.", result.eligibilityReason());
    }

    @Test
    void testScore_highDti() {
        PredictionRequest req = createBaseRequest();
        req.setMonthlyIncome(new BigDecimal("20000.00"));
        req.setExistingEmi(new BigDecimal("15000.00")); // Very high DTI

        var result = scoringEngine.score(req);
        assertFalse(result.eligible(), "Should not be eligible due to high risk");
        assertTrue(result.riskScore() > 60, "Risk score should be elevated/high");
    }

    @Test
    void testEmiCalculation_edgeCases() {
        BigDecimal emi = scoringEngine.emi(BigDecimal.ZERO, 12);
        assertEquals(BigDecimal.ZERO, emi);

        emi = scoringEngine.emi(new BigDecimal("100000.00"), 0);
        assertEquals(BigDecimal.ZERO, emi);
    }
}
