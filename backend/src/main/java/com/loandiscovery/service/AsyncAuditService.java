package com.loandiscovery.service;

import com.loandiscovery.entity.LoanDecision;
import com.loandiscovery.repository.LoanDecisionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AsyncAuditService {
    private static final Logger log = LoggerFactory.getLogger(AsyncAuditService.class);
    private final LoanDecisionRepository decisionRepository;

    public AsyncAuditService(LoanDecisionRepository decisionRepository) {
        this.decisionRepository = decisionRepository;
    }

    @Async("auditTaskExecutor")
    @Transactional
    public void saveDecisionAsync(LoanDecision decision) {
        try {
            decisionRepository.save(decision);
            log.info("Async Audit Written for decision idempotency key: {}", decision.getIdempotencyKey());
        } catch (Exception e) {
            log.error("Failed to write async audit for decision.", e);
        }
    }
}
