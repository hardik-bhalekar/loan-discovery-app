package com.loandiscovery.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Immutable audit record for every loan decision produced by the scoring engine.
 * <p>
 * Security invariants:
 * <ul>
 *   <li>No raw PII (name, email, phone) — only the foreign-key userId</li>
 *   <li>Unique (userId, idempotencyKey) prevents duplicate decisions</li>
 *   <li>Timestamps are server-assigned, never client-supplied</li>
 * </ul>
 */
@Entity
@Table(
    name = "loan_decisions",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_loan_decisions_user_idempotency",
        columnNames = {"user_id", "idempotency_key"}
    ),
    indexes = {
        @Index(name = "idx_loan_decisions_user_time", columnList = "user_id, decided_at DESC")
    }
)
public class LoanDecision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, updatable = false)
    private com.loandiscovery.model.User user;

    @Column(name = "idempotency_key", nullable = false, length = 64, updatable = false)
    private String idempotencyKey;

    // ---- Snapshot of inputs (for audit replay) ----

    @Column(name = "monthly_income", nullable = false, precision = 15, scale = 2)
    private BigDecimal monthlyIncome;

    @Column(name = "credit_score", nullable = false)
    private Integer creditScore;

    @Column(name = "existing_emi", precision = 15, scale = 2)
    private BigDecimal existingEmi;

    @Column(name = "loan_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal loanAmount;

    @Column(name = "loan_type", nullable = false, length = 80)
    private String loanType;

    @Column(nullable = false)
    private Integer tenure;

    @Column(length = 200)
    private String purpose;

    // ---- Decision outputs ----

    @Column(name = "risk_score", nullable = false)
    private Integer riskScore;

    @Column(name = "risk_band", nullable = false, length = 20)
    private String riskBand;

    @Column(nullable = false)
    private Boolean eligible;

    @Column(name = "eligibility_reason", length = 500)
    private String eligibilityReason;

    @Column(name = "max_eligible_amount", precision = 15, scale = 2)
    private BigDecimal maxEligibleAmount;

    @Column(name = "recommended_emi", precision = 15, scale = 2)
    private BigDecimal recommendedEmi;

    // ---- Breakdown weights ----

    @Column(name = "credit_score_weight")
    private Integer creditScoreWeight;

    @Column(name = "dti_weight")
    private Integer dtiWeight;

    @Column(name = "income_stability_weight")
    private Integer incomeStabilityWeight;

    @Column(name = "tenure_weight")
    private Integer tenureWeight;

    @Column(name = "loan_type_weight")
    private Integer loanTypeWeight;

    // ---- Metadata ----

    @Column(name = "decided_at", nullable = false, updatable = false)
    private LocalDateTime decidedAt;

    @Column(name = "client_ip", length = 45)
    private String clientIp;

    @PrePersist
    protected void onCreate() {
        this.decidedAt = LocalDateTime.now();
    }

    // ---- Getters / Setters ----

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public com.loandiscovery.model.User getUser() { return user; }
    public void setUser(com.loandiscovery.model.User user) { this.user = user; }

    public String getIdempotencyKey() { return idempotencyKey; }
    public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }

    public BigDecimal getMonthlyIncome() { return monthlyIncome; }
    public void setMonthlyIncome(BigDecimal monthlyIncome) { this.monthlyIncome = monthlyIncome; }

    public Integer getCreditScore() { return creditScore; }
    public void setCreditScore(Integer creditScore) { this.creditScore = creditScore; }

    public BigDecimal getExistingEmi() { return existingEmi; }
    public void setExistingEmi(BigDecimal existingEmi) { this.existingEmi = existingEmi; }

    public BigDecimal getLoanAmount() { return loanAmount; }
    public void setLoanAmount(BigDecimal loanAmount) { this.loanAmount = loanAmount; }

    public String getLoanType() { return loanType; }
    public void setLoanType(String loanType) { this.loanType = loanType; }

    public Integer getTenure() { return tenure; }
    public void setTenure(Integer tenure) { this.tenure = tenure; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }

    public String getRiskBand() { return riskBand; }
    public void setRiskBand(String riskBand) { this.riskBand = riskBand; }

    public Boolean getEligible() { return eligible; }
    public void setEligible(Boolean eligible) { this.eligible = eligible; }

    public String getEligibilityReason() { return eligibilityReason; }
    public void setEligibilityReason(String eligibilityReason) { this.eligibilityReason = eligibilityReason; }

    public BigDecimal getMaxEligibleAmount() { return maxEligibleAmount; }
    public void setMaxEligibleAmount(BigDecimal maxEligibleAmount) { this.maxEligibleAmount = maxEligibleAmount; }

    public BigDecimal getRecommendedEmi() { return recommendedEmi; }
    public void setRecommendedEmi(BigDecimal recommendedEmi) { this.recommendedEmi = recommendedEmi; }

    public Integer getCreditScoreWeight() { return creditScoreWeight; }
    public void setCreditScoreWeight(Integer creditScoreWeight) { this.creditScoreWeight = creditScoreWeight; }

    public Integer getDtiWeight() { return dtiWeight; }
    public void setDtiWeight(Integer dtiWeight) { this.dtiWeight = dtiWeight; }

    public Integer getIncomeStabilityWeight() { return incomeStabilityWeight; }
    public void setIncomeStabilityWeight(Integer incomeStabilityWeight) { this.incomeStabilityWeight = incomeStabilityWeight; }

    public Integer getTenureWeight() { return tenureWeight; }
    public void setTenureWeight(Integer tenureWeight) { this.tenureWeight = tenureWeight; }

    public Integer getLoanTypeWeight() { return loanTypeWeight; }
    public void setLoanTypeWeight(Integer loanTypeWeight) { this.loanTypeWeight = loanTypeWeight; }

    public LocalDateTime getDecidedAt() { return decidedAt; }
    public void setDecidedAt(LocalDateTime decidedAt) { this.decidedAt = decidedAt; }

    public String getClientIp() { return clientIp; }
    public void setClientIp(String clientIp) { this.clientIp = clientIp; }
}
