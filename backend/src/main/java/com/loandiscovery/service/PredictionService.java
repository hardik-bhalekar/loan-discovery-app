package com.loandiscovery.service;

import com.loandiscovery.dto.PredictionRequest;
import com.loandiscovery.dto.PredictionResponse;
import com.loandiscovery.entity.LoanDecision;
import com.loandiscovery.model.User;
import com.loandiscovery.repository.LoanDecisionRepository;
import com.loandiscovery.repository.StatementReportRepository;
import com.loandiscovery.security.CurrentUserService;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Orchestrates prediction requests: identity resolution, idempotency,
 * scoring, persistence, and audit logging.
 * <p>
 * Security invariants enforced here:
 * <ul>
 *   <li>userId always comes from the JWT — never from the request body</li>
 *   <li>Idempotency key is scoped per-user to prevent cross-user replay</li>
 *   <li>Logs never contain raw PII (email, name, phone)</li>
 * </ul>
 */
@Service
public class PredictionService {

    private static final Logger log = LoggerFactory.getLogger(PredictionService.class);

    private final CurrentUserService currentUserService;
    private final ScoringEngine scoringEngine;
    private final LoanDecisionRepository decisionRepository;
    private final StatementReportRepository statementRepository;
    private final FraudService fraudService;
    private final AsyncAuditService asyncAuditService;

    public PredictionService(CurrentUserService currentUserService,
                             ScoringEngine scoringEngine,
                             LoanDecisionRepository decisionRepository,
                             StatementReportRepository statementRepository,
                             FraudService fraudService,
                             AsyncAuditService asyncAuditService) {
        this.currentUserService = currentUserService;
        this.scoringEngine = scoringEngine;
        this.decisionRepository = decisionRepository;
        this.statementRepository = statementRepository;
        this.fraudService = fraudService;
        this.asyncAuditService = asyncAuditService;
    }

    /**
     * Compute risk score and persist decision. Idempotent on (userId, idempotencyKey).
     */
    @Transactional
    @CacheEvict(value = "decisions", allEntries = true)
    public PredictionResponse computeRiskScore(PredictionRequest request, String clientIp) {
        User user = currentUserService.getCurrentUserEntity();

        // Idempotency: return existing decision if key already used
        var existing = decisionRepository
                .findByUserIdAndIdempotencyKey(user.getId(), request.getIdempotencyKey());
        if (existing.isPresent()) {
            log.info("Idempotent hit: userId={} key={}", user.getId(), request.getIdempotencyKey());
            return toResponse(existing.get());
        }

        // Apply Bank Statement Intelligence if available
        statementRepository.findTopByUserIdOrderByUploadedAtDesc(user.getId())
                .ifPresent(report -> {
                    // Inject intelligent bounds extracted from PDF
                    request.setBounceCount(report.getBounceCount());
                });

        // Fraud Check
        List<String> fraudReasons = fraudService.detectFraud(user, request, clientIp);
        if (!fraudReasons.isEmpty()) {
            LoanDecision fraudDecision = new LoanDecision();
            fraudDecision.setUser(user);
            fraudDecision.setClientIp(sanitizeIp(clientIp));
            fraudDecision.setMonthlyIncome(request.getMonthlyIncome());
            fraudDecision.setCreditScore(request.getCreditScore());
            fraudDecision.setExistingEmi(request.getExistingEmi() != null ? request.getExistingEmi() : BigDecimal.ZERO);
            fraudDecision.setLoanAmount(request.getLoanAmount());
            fraudDecision.setLoanType(request.getLoanType() != null ? request.getLoanType().trim() : "unknown");
            fraudDecision.setTenure(request.getTenure());
            fraudDecision.setPurpose(request.getPurpose() != null ? request.getPurpose().trim() : null);
            fraudDecision.setIdempotencyKey(request.getIdempotencyKey());
            fraudDecision.setRiskScore(100);
            fraudDecision.setRiskBand("VERY_HIGH");
            fraudDecision.setEligible(false);
            fraudDecision.setEligibilityReason("Rejected due to security policy constraints.");
            fraudDecision.setMaxEligibleAmount(BigDecimal.ZERO);
            fraudDecision.setRecommendedEmi(BigDecimal.ZERO);
            
            // Async Audit Write
            asyncAuditService.saveDecisionAsync(fraudDecision);
            
            log.warn("Decision rejected due to fraud detection for user={}", user.getId());
            return toResponse(fraudDecision);
        }

        ScoringEngine.ScoringResult result = scoringEngine.score(request);
        LoanDecision decision = buildDecision(user, request, result, clientIp);
        
        // Async Audit Write
        asyncAuditService.saveDecisionAsync(decision);

        log.info("Decision created: idempotencyKey={} userId={} risk={} eligible={}",
                decision.getIdempotencyKey(), user.getId(), result.riskScore(), result.eligible());

        return toResponse(decision);
    }

    /**
     * Compute eligibility only. Re-uses the same scoring pipeline
     * and persistence for full audit trail.
     */
    @Transactional
    public PredictionResponse computeEligibility(PredictionRequest request, String clientIp) {
        // Same pipeline — the response includes both risk and eligibility
        return computeRiskScore(request, clientIp);
    }

    /**
     * Return the current user's decision history with pagination support.
     */
    @Cacheable(value = "decisions", key = "#userId + '-' + #page + '-' + #size")
    @Transactional(readOnly = true)
    public Page<PredictionResponse> getMyDecisions(Long userId, int page, int size) {
        return decisionRepository.findByUserIdOrderByDecidedAtDesc(userId, PageRequest.of(page, size))
                .map(this::toResponse);
    }

    /**
     * Retention Strategy: Runs daily at 2 AM to clean up decisions older than 90 days.
     * Prevents the audit table from growing infinitely.
     */
    @Scheduled(cron = "0 0 2 * * ?")
    @Transactional
    public void cleanupOldDecisions() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(90);
        int deleted = decisionRepository.deleteOlderThan(cutoff);
        log.info("Retention strategy executed. Deleted {} loan decisions older than {}.", deleted, cutoff);
    }

    // ---- Internals ----

    private LoanDecision buildDecision(User user, PredictionRequest req,
                                       ScoringEngine.ScoringResult res, String clientIp) {
        LoanDecision d = new LoanDecision();
        d.setUser(user);
        d.setIdempotencyKey(req.getIdempotencyKey());

        // Input snapshot
        d.setMonthlyIncome(req.getMonthlyIncome());
        d.setCreditScore(req.getCreditScore());
        d.setExistingEmi(req.getExistingEmi() != null ? req.getExistingEmi() : BigDecimal.ZERO);
        d.setLoanAmount(req.getLoanAmount());
        d.setLoanType(req.getLoanType().trim());
        d.setTenure(req.getTenure());
        d.setPurpose(req.getPurpose() != null ? req.getPurpose().trim() : null);

        // Decision outputs
        d.setRiskScore(res.riskScore());
        d.setRiskBand(res.riskBand());
        d.setEligible(res.eligible());
        d.setEligibilityReason(res.eligibilityReason());
        d.setMaxEligibleAmount(res.maxEligibleAmount());
        d.setRecommendedEmi(res.recommendedEmi());

        // Breakdown
        d.setCreditScoreWeight(res.breakdown().creditScoreWeight());
        d.setDtiWeight(res.breakdown().dtiWeight());
        d.setIncomeStabilityWeight(res.breakdown().incomeStabilityWeight());
        d.setTenureWeight(res.breakdown().tenureWeight());
        d.setLoanTypeWeight(res.breakdown().loanTypeWeight());

        // Audit metadata
        d.setClientIp(sanitizeIp(clientIp));

        return d;
    }

    private PredictionResponse toResponse(LoanDecision d) {
        return new PredictionResponse(
                d.getId(),
                d.getIdempotencyKey(),
                d.getRiskScore(),
                d.getRiskBand(),
                d.getEligible(),
                d.getEligibilityReason(),
                d.getMaxEligibleAmount(),
                d.getRecommendedEmi(),
                new PredictionResponse.Breakdown(
                        d.getCreditScoreWeight(),
                        d.getDtiWeight(),
                        d.getIncomeStabilityWeight(),
                        d.getTenureWeight(),
                        d.getLoanTypeWeight()
                ),
                d.getDecidedAt()
        );
    }

    /** Strip non-IP characters to prevent log-injection via X-Forwarded-For. */
    private String sanitizeIp(String raw) {
        if (raw == null) return null;
        return raw.replaceAll("[^0-9a-fA-F.:,]", "").substring(0, Math.min(raw.length(), 45));
    }
}
