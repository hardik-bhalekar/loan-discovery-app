package com.loandiscovery.dto;

import java.time.LocalDateTime;

public class InterestRateResponse {

    private Long id;
    private String bankName;
    private String loanType;
    private Double interestRateMin;
    private Double interestRateMax;
    private String rateType;
    private String processingFee;
    private String sourceUrl;
    private String bankPageUrl;
    private LocalDateTime scrapedAt;

    public InterestRateResponse() {
    }

    public InterestRateResponse(Long id, String bankName, String loanType,
                                 Double interestRateMin, Double interestRateMax,
                                 String rateType, String processingFee,
                                 String sourceUrl, String bankPageUrl, LocalDateTime scrapedAt) {
        this.id = id;
        this.bankName = bankName;
        this.loanType = loanType;
        this.interestRateMin = interestRateMin;
        this.interestRateMax = interestRateMax;
        this.rateType = rateType;
        this.processingFee = processingFee;
        this.sourceUrl = sourceUrl;
        this.bankPageUrl = bankPageUrl;
        this.scrapedAt = scrapedAt;
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
}
