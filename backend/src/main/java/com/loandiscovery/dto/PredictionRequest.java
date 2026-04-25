package com.loandiscovery.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

/**
 * Inbound request for risk-score and eligibility endpoints.
 * <p>
 * Security: no userId field — the server always resolves identity from the JWT.
 * The idempotencyKey lets clients safely retry without creating duplicate decisions.
 */
public class PredictionRequest {

    @NotBlank(message = "Idempotency key is required")
    @Size(min = 16, max = 64, message = "Idempotency key must be 16–64 characters")
    @Pattern(regexp = "^[A-Za-z0-9_-]+$", message = "Idempotency key contains invalid characters")
    private String idempotencyKey;

    @NotNull(message = "Monthly income is required")
    @DecimalMin(value = "0.00", message = "Monthly income must be non-negative")
    @DecimalMax(value = "999999999.99", message = "Monthly income exceeds allowed range")
    private BigDecimal monthlyIncome;

    @NotNull(message = "Credit score is required")
    @Min(value = 300, message = "Credit score must be at least 300")
    @Max(value = 900, message = "Credit score must be at most 900")
    private Integer creditScore;

    @DecimalMin(value = "0.00", message = "Existing EMI must be non-negative")
    @DecimalMax(value = "999999999.99", message = "Existing EMI exceeds allowed range")
    private BigDecimal existingEmi;

    @NotNull(message = "Requested loan amount is required")
    @DecimalMin(value = "10000.00", message = "Loan amount must be at least ₹10,000")
    @DecimalMax(value = "999999999.99", message = "Loan amount exceeds allowed range")
    private BigDecimal loanAmount;

    @NotBlank(message = "Loan type is required")
    @Size(max = 80, message = "Loan type must be ≤ 80 characters")
    @Pattern(regexp = "^[A-Za-z ]+$", message = "Loan type contains invalid characters")
    private String loanType;

    @NotNull(message = "Tenure is required")
    @Min(value = 6, message = "Tenure must be at least 6 months")
    @Max(value = 360, message = "Tenure must be at most 360 months")
    private Integer tenure;

    private Integer bounceCount; // Optional feature extracted from statements

    @Size(max = 200, message = "Purpose must be ≤ 200 characters")
    @Pattern(regexp = "^[A-Za-z0-9 .,/-]*$", message = "Purpose contains invalid characters")
    private String purpose;

    // ---- Getters / Setters ----

    public String getIdempotencyKey() {
        return idempotencyKey;
    }

    public void setIdempotencyKey(String idempotencyKey) {
        this.idempotencyKey = idempotencyKey;
    }

    public BigDecimal getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(BigDecimal monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public Integer getCreditScore() {
        return creditScore;
    }

    public void setCreditScore(Integer creditScore) {
        this.creditScore = creditScore;
    }

    public BigDecimal getExistingEmi() {
        return existingEmi;
    }

    public void setExistingEmi(BigDecimal existingEmi) {
        this.existingEmi = existingEmi;
    }

    public BigDecimal getLoanAmount() {
        return loanAmount;
    }

    public void setLoanAmount(BigDecimal loanAmount) {
        this.loanAmount = loanAmount;
    }

    public String getLoanType() {
        return loanType;
    }

    public void setLoanType(String loanType) {
        this.loanType = loanType;
    }

    public Integer getTenure() {
        return tenure;
    }

    public void setTenure(Integer tenure) {
        this.tenure = tenure;
    }

    public Integer getBounceCount() {
        return bounceCount;
    }

    public void setBounceCount(Integer bounceCount) {
        this.bounceCount = bounceCount;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }
}
