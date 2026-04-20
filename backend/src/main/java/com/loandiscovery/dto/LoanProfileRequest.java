package com.loandiscovery.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class LoanProfileRequest {

    @NotNull(message = "Monthly income is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Monthly income must be greater than 0")
    private BigDecimal monthlyIncome;

    @NotNull(message = "Credit score is required")
    @Min(value = 300, message = "Credit score must be at least 300")
    @Max(value = 900, message = "Credit score must be at most 900")
    private Integer creditScore;

    @DecimalMin(value = "0.0", inclusive = true, message = "Existing EMI cannot be negative")
    private BigDecimal existingEmi;

    @NotNull(message = "Loan amount is required")
    @DecimalMin(value = "10000.0", inclusive = true, message = "Loan amount must be at least 10000")
    private BigDecimal loanAmount;

    @NotNull(message = "Loan type is required")
    @Size(max = 80, message = "Loan type can be at most 80 characters")
    private String loanType;

    @NotNull(message = "Tenure is required")
    @Min(value = 1, message = "Tenure must be at least 1 year")
    @Max(value = 30, message = "Tenure must be at most 30 years")
    private Integer tenure;

    @Size(max = 200, message = "Purpose can be at most 200 characters")
    private String purpose;

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

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }
}
