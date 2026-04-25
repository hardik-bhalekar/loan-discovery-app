package com.loandiscovery.repository;

import com.loandiscovery.entity.LoanDecision;
import com.loandiscovery.model.User;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.dao.DataIntegrityViolationException;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class LoanDecisionRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private LoanDecisionRepository repository;

    private User createUser() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setName("Test User");
        return entityManager.persist(user);
    }

    private LoanDecision createDecision(User user, String key) {
        LoanDecision d = new LoanDecision();
        d.setUser(user);
        d.setIdempotencyKey(key);
        d.setMonthlyIncome(new BigDecimal("50000"));
        d.setCreditScore(700);
        d.setLoanAmount(new BigDecimal("100000"));
        d.setLoanType("Personal Loan");
        d.setTenure(24);
        d.setRiskScore(30);
        d.setRiskBand("LOW");
        d.setEligible(true);
        return d;
    }

    @Test
    void testSaveAndFindByIdempotencyKey() {
        User user = createUser();
        LoanDecision d = createDecision(user, "idemp-1234567890");
        repository.save(d);

        Optional<LoanDecision> found = repository.findByUserIdAndIdempotencyKey(user.getId(), "idemp-1234567890");
        assertTrue(found.isPresent());
        assertEquals(30, found.get().getRiskScore());
    }

    @Test
    void testUniqueConstraintOnUserAndIdempotencyKey() {
        User user = createUser();
        LoanDecision d1 = createDecision(user, "duplicate-key");
        repository.save(d1);
        entityManager.flush();

        LoanDecision d2 = createDecision(user, "duplicate-key");
        assertThrows(DataIntegrityViolationException.class, () -> {
            repository.save(d2);
            entityManager.flush();
        });
    }

    @Test
    void testFindTop50OrderByDecidedAt() {
        User user = createUser();
        for (int i = 0; i < 55; i++) {
            repository.save(createDecision(user, "key-" + i));
        }
        entityManager.flush();

        List<LoanDecision> history = repository.findByUserIdOrderByDecidedAtDesc(user.getId(), org.springframework.data.domain.PageRequest.of(0, 50)).getContent();
        assertEquals(50, history.size(), "Should limit to exactly 50 recent records");
    }
}
