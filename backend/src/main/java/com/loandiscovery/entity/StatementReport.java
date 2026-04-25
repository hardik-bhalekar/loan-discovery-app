package com.loandiscovery.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "statement_reports", indexes = {
    @Index(name = "idx_statement_reports_user_id", columnList = "user_id")
})
public class StatementReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    private BigDecimal averageMonthlyIncome;
    private BigDecimal totalDetectedEmis;
    private int bounceCount;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String cashflowJson;

    private LocalDateTime uploadedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public BigDecimal getAverageMonthlyIncome() { return averageMonthlyIncome; }
    public void setAverageMonthlyIncome(BigDecimal averageMonthlyIncome) { this.averageMonthlyIncome = averageMonthlyIncome; }
    public BigDecimal getTotalDetectedEmis() { return totalDetectedEmis; }
    public void setTotalDetectedEmis(BigDecimal totalDetectedEmis) { this.totalDetectedEmis = totalDetectedEmis; }
    public int getBounceCount() { return bounceCount; }
    public void setBounceCount(int bounceCount) { this.bounceCount = bounceCount; }
    public String getCashflowJson() { return cashflowJson; }
    public void setCashflowJson(String cashflowJson) { this.cashflowJson = cashflowJson; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
