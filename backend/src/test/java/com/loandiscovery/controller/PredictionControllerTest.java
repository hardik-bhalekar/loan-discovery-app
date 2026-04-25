package com.loandiscovery.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loandiscovery.dto.PredictionRequest;
import com.loandiscovery.dto.PredictionResponse;
import com.loandiscovery.service.PredictionService;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class PredictionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PredictionService predictionService;

    private PredictionRequest createValidRequest() {
        PredictionRequest req = new PredictionRequest();
        req.setIdempotencyKey("valid-key-12345678");
        req.setMonthlyIncome(new BigDecimal("50000"));
        req.setCreditScore(700);
        req.setLoanAmount(new BigDecimal("100000"));
        req.setLoanType("Personal Loan");
        req.setTenure(24);
        return req;
    }

    private PredictionResponse createMockResponse() {
        return new PredictionResponse(
                1L, "valid-key-12345678", 35, "MODERATE", true,
                "OK", new BigDecimal("500000"), new BigDecimal("5000"),
                new PredictionResponse.Breakdown(15, 25, 40, 20, 35),
                LocalDateTime.now()
        );
    }

    @Test
    @WithMockUser
    void testRiskScore_success() throws Exception {
        PredictionRequest req = createValidRequest();
        when(predictionService.computeRiskScore(any(PredictionRequest.class), anyString()))
                .thenReturn(createMockResponse());

        mockMvc.perform(post("/api/risk-score")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.riskScore").value(35))
                .andExpect(jsonPath("$.eligible").value(true));
    }

    @Test
    @WithMockUser
    void testValidation_invalidIdempotencyKey() throws Exception {
        PredictionRequest req = createValidRequest();
        req.setIdempotencyKey("short"); // Invalid: < 16 chars

        mockMvc.perform(post("/api/risk-score")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation failed"));
    }

    @Test
    void testAuth_unauthenticatedAccess() throws Exception {
        // No @WithMockUser
        PredictionRequest req = createValidRequest();

        mockMvc.perform(post("/api/risk-score")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized()); // Or 403 based on config
    }
}
