package com.loandiscovery.repository;

import com.loandiscovery.entity.LoanDecision;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LoanDecisionRepository extends JpaRepository<LoanDecision, Long> {

    /**
     * Idempotency check — scoped to user so one user cannot replay another's key.
     */
    Optional<LoanDecision> findByUserIdAndIdempotencyKey(Long userId, String idempotencyKey);

    /**
     * Paginated decision history for a single user.
     * Uses idx_loan_decisions_user_time composite index.
     */
    Page<LoanDecision> findByUserIdOrderByDecidedAtDesc(Long userId, Pageable pageable);

    int countByUserIdAndDecidedAtAfter(Long userId, LocalDateTime after);

    int countByClientIpAndDecidedAtAfter(String clientIp, LocalDateTime after);

    Optional<LoanDecision> findTopByUserIdOrderByLoanAmountDesc(Long userId);

    /**
     * Retention strategy: Delete audits older than a specified date.
     */
    @Modifying
    @Query("DELETE FROM LoanDecision d WHERE d.decidedAt < :cutoffDate")
    int deleteOlderThan(@Param("cutoffDate") LocalDateTime cutoffDate);
}
