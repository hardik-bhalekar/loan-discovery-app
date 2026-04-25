package com.loandiscovery.controller;

import com.loandiscovery.dto.PredictionRequest;
import com.loandiscovery.dto.PredictionResponse;
import com.loandiscovery.security.CurrentUserService;
import com.loandiscovery.service.PredictionService;
import com.loandiscovery.service.RateLimitingService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.time.Duration;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Loan-decision endpoints — all require a valid JWT.
 * <p>
 * The controller never accepts a userId from the client;
 * identity is resolved server-side via the Security Context.
 */
@RestController
@RequestMapping("/api")
public class PredictionController {

    private final PredictionService predictionService;
    private final CurrentUserService currentUserService;
    private final RateLimitingService rateLimitingService;

    public PredictionController(PredictionService predictionService, 
                                CurrentUserService currentUserService,
                                RateLimitingService rateLimitingService) {
        this.predictionService = predictionService;
        this.currentUserService = currentUserService;
        this.rateLimitingService = rateLimitingService;
    }

    /**
     * Compute a risk score for the authenticated user.
     * Idempotent — repeated calls with the same idempotencyKey
     * return the original decision.
     */
    @PostMapping("/risk-score")
    public ResponseEntity<PredictionResponse> riskScore(
            @Valid @RequestBody PredictionRequest request,
            HttpServletRequest httpRequest) {

        String clientIp = resolveClientIp(httpRequest);
        
        // Rate Limiting: Max 10 requests per minute per IP
        if (!rateLimitingService.allowRequest(clientIp, 10, Duration.ofMinutes(1))) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
        }

        PredictionResponse response = predictionService.computeRiskScore(request, clientIp);
        return ResponseEntity.ok(response);
    }

    /**
     * Compute eligibility for the authenticated user.
     * Shares the same scoring pipeline and audit trail as /risk-score.
     */
    @PostMapping("/eligibility")
    public ResponseEntity<PredictionResponse> eligibility(
            @Valid @RequestBody PredictionRequest request,
            HttpServletRequest httpRequest) {

        String clientIp = resolveClientIp(httpRequest);
        PredictionResponse response = predictionService.computeEligibility(request, clientIp);
        return ResponseEntity.ok(response);
    }

    /**
     * Return the current user's decision history with pagination.
     */
    @GetMapping("/decisions/me")
    public ResponseEntity<Page<PredictionResponse>> myDecisions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        // Cap max size to prevent large queries
        int boundedSize = Math.min(size, 50);
        Long userId = currentUserService.getCurrentUserEntity().getId();
        return ResponseEntity.ok(predictionService.getMyDecisions(userId, page, boundedSize));
    }

    /**
     * Best-effort client IP resolution. Takes the first IP from
     * X-Forwarded-For (original client) to prevent proxy spoofing,
     * or falls back to remote address.
     */
    private String resolveClientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            return xff.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
