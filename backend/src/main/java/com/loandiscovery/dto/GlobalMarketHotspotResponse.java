package com.loandiscovery.dto;

import java.time.LocalDateTime;
import java.util.List;

public class GlobalMarketHotspotResponse {

    private final String city;
    private final String country;
    private final Double lat;
    private final Double lng;
    private final Double mortgageRate;
    private final Double personalLoan;
    private final Double autoLoan;
    private final Double businessLoan;
    private final Double policyRate;
    private final Double inflation;
    private final String currency;
    private final String trend;
    private final List<String> banks;
    private final LocalDateTime updatedAt;

    public GlobalMarketHotspotResponse(
            String city,
            String country,
            Double lat,
            Double lng,
            Double mortgageRate,
            Double personalLoan,
            Double autoLoan,
            Double businessLoan,
            Double policyRate,
            Double inflation,
            String currency,
            String trend,
            List<String> banks,
            LocalDateTime updatedAt
    ) {
        this.city = city;
        this.country = country;
        this.lat = lat;
        this.lng = lng;
        this.mortgageRate = mortgageRate;
        this.personalLoan = personalLoan;
        this.autoLoan = autoLoan;
        this.businessLoan = businessLoan;
        this.policyRate = policyRate;
        this.inflation = inflation;
        this.currency = currency;
        this.trend = trend;
        this.banks = banks;
        this.updatedAt = updatedAt;
    }

    public String getCity() {
        return city;
    }

    public String getCountry() {
        return country;
    }

    public Double getLat() {
        return lat;
    }

    public Double getLng() {
        return lng;
    }

    public Double getMortgageRate() {
        return mortgageRate;
    }

    public Double getPersonalLoan() {
        return personalLoan;
    }

    public Double getAutoLoan() {
        return autoLoan;
    }

    public Double getBusinessLoan() {
        return businessLoan;
    }

    public Double getPolicyRate() {
        return policyRate;
    }

    public Double getInflation() {
        return inflation;
    }

    public String getCurrency() {
        return currency;
    }

    public String getTrend() {
        return trend;
    }

    public List<String> getBanks() {
        return banks;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}