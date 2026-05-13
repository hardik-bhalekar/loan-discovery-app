package com.loandiscovery.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "interest_rates", indexes = {
    @Index(name = "idx_ir_loan_type", columnList = "loanType"),
    @Index(name = "idx_ir_latest", columnList = "isLatest"),
    @Index(name = "idx_ir_bank_loan", columnList = "bankName, loanType")
})
public class InterestRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String bankName;

    @Column(nullable = false, length = 50)
    private String loanType;

    @Column(nullable = false)
    private Double interestRateMin;

    @Column
    private Double interestRateMax;

    @Column(length = 20)
    private String rateType;

    @Column(length = 500)
    private String processingFee;

    @Column(length = 300)
    private String sourceUrl;

    @Column(length = 300)
    private String bankPageUrl;

    @Column(nullable = false)
    private LocalDateTime scrapedAt;

    @Column(nullable = false)
    private Boolean isLatest = true;

    @PrePersist
    protected void onCreate() {
        if (this.scrapedAt == null) {
            this.scrapedAt = LocalDateTime.now();
        }
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getLoanType() {
        return loanType;
    }

    public void setLoanType(String loanType) {
        this.loanType = loanType;
    }

    public Double getInterestRateMin() {
        return interestRateMin;
    }

    public void setInterestRateMin(Double interestRateMin) {
        this.interestRateMin = interestRateMin;
    }

    public Double getInterestRateMax() {
        return interestRateMax;
    }

    public void setInterestRateMax(Double interestRateMax) {
        this.interestRateMax = interestRateMax;
    }

    public String getRateType() {
        return rateType;
    }

    public void setRateType(String rateType) {
        this.rateType = rateType;
    }

    public String getProcessingFee() {
        return processingFee;
    }

    public void setProcessingFee(String processingFee) {
        this.processingFee = processingFee;
    }

    public String getSourceUrl() {
        return sourceUrl;
    }

    public void setSourceUrl(String sourceUrl) {
        this.sourceUrl = sourceUrl;
    }

    public String getBankPageUrl() {
        return bankPageUrl;
    }

    public void setBankPageUrl(String bankPageUrl) {
        this.bankPageUrl = bankPageUrl;
    }

    public LocalDateTime getScrapedAt() {
        return scrapedAt;
    }

    public void setScrapedAt(LocalDateTime scrapedAt) {
        this.scrapedAt = scrapedAt;
    }

    public Boolean getIsLatest() {
        return isLatest;
    }

    public void setIsLatest(Boolean isLatest) {
        this.isLatest = isLatest;
    }
}
