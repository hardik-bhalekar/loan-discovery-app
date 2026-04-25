package com.loandiscovery.service;

import com.loandiscovery.dto.PredictionRequest;
import com.loandiscovery.dto.PredictionResponse;
import com.loandiscovery.entity.LoanDecision;
import com.loandiscovery.model.User;
import com.loandiscovery.repository.LoanDecisionRepository;
import com.loandiscovery.security.CurrentUserService;
import java.math.BigDecimal;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PredictionServiceIdempotencyTest {

    @Mock
    private CurrentUserService currentUserService;

    @Mock
    private ScoringEngine scoringEngine;

    @Mock
    private LoanDecisionRepository decisionRepository;

    @InjectMocks
    private PredictionService predictionService;

    private User mockUser;
    private PredictionRequest request;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(99L);
        when(currentUserService.getCurrentUserEntity()).thenReturn(mockUser);

        request = new PredictionRequest();
        request.setIdempotencyKey("idempotency-key-1234");
        request.setMonthlyIncome(new BigDecimal("50000"));
        request.setCreditScore(700);
        request.setLoanAmount(new BigDecimal("100000"));
        request.setLoanType("Personal Loan");
        request.setTenure(24);
    }

    @Test
    void testComputeRiskScore_firstTime_createsNewDecision() {
        when(decisionRepository.findByUserIdAndIdempotencyKey(99L, "idempotency-key-1234"))
                .thenReturn(Optional.empty());
                
        var engineResult = new ScoringEngine.ScoringResult(
                35, "MODERATE", true, "OK", new BigDecimal("500000"),
                new BigDecimal("5000"), new PredictionResponse.Breakdown(1,2,3,4,5));
        when(scoringEngine.score(any())).thenReturn(engineResult);

        LoanDecision savedDecision = new LoanDecision();
        savedDecision.setId(10L);
        savedDecision.setIdempotencyKey("idempotency-key-1234");
        savedDecision.setRiskScore(35);
        when(decisionRepository.save(any())).thenReturn(savedDecision);

        PredictionResponse response = predictionService.computeRiskScore(request, "127.0.0.1");

        assertNotNull(response);
        assertEquals(10L, response.decisionId());
        verify(decisionRepository).save(any());
    }

    @Test
    void testComputeRiskScore_idempotentHit_returnsExistingDecisionWithoutScoring() {
        LoanDecision existing = new LoanDecision();
        existing.setId(20L);
        existing.setIdempotencyKey("idempotency-key-1234");
        existing.setRiskScore(45);

        when(decisionRepository.findByUserIdAndIdempotencyKey(99L, "idempotency-key-1234"))
                .thenReturn(Optional.of(existing));

        PredictionResponse response = predictionService.computeRiskScore(request, "127.0.0.1");

        assertNotNull(response);
        assertEquals(20L, response.decisionId());
        assertEquals(45, response.riskScore());

        // Ensure engine and save were NOT called
        verifyNoInteractions(scoringEngine);
        verify(decisionRepository, never()).save(any());
    }
}
