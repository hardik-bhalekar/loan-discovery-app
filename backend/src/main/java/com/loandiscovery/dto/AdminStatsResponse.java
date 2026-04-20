package com.loandiscovery.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class AdminStatsResponse {

    private final long totalUsers;
    private final long totalComparisons;
    private final Map<String, Long> loanTypePopularity;
    private final BigDecimal avgLoanAmount;
    private final List<RecentSignup> recentSignups;

    public AdminStatsResponse(
            long totalUsers,
            long totalComparisons,
            Map<String, Long> loanTypePopularity,
            BigDecimal avgLoanAmount,
            List<RecentSignup> recentSignups
    ) {
        this.totalUsers = totalUsers;
        this.totalComparisons = totalComparisons;
        this.loanTypePopularity = loanTypePopularity;
        this.avgLoanAmount = avgLoanAmount;
        this.recentSignups = recentSignups;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public long getTotalComparisons() {
        return totalComparisons;
    }

    public Map<String, Long> getLoanTypePopularity() {
        return loanTypePopularity;
    }

    public BigDecimal getAvgLoanAmount() {
        return avgLoanAmount;
    }

    public List<RecentSignup> getRecentSignups() {
        return recentSignups;
    }

    public record RecentSignup(Long userId, String name, String email, LocalDateTime createdAt) {
    }
}
