package com.loandiscovery.service;

import com.loandiscovery.dto.PredictionRequest;
import com.loandiscovery.dto.PredictionResponse;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class ScoringEngine {

    private static final BigDecimal SAFE_DTI = new BigDecimal("0.40");
    private static final BigDecimal MAX_DTI = new BigDecimal("0.50");
    private static final BigDecimal ANNUAL_RATE = new BigDecimal("0.10");
    private static final Map<String, Integer> TYPE_SCORES = Map.of(
            "home loan", 10, "education loan", 15, "car loan", 20,
            "personal loan", 35, "business loan", 40, "gold loan", 12);

    public ScoringResult score(PredictionRequest req) {
        BigDecimal income = req.getMonthlyIncome();
        int cs = req.getCreditScore();
        BigDecimal emi0 = req.getExistingEmi() != null ? req.getExistingEmi() : BigDecimal.ZERO;
        BigDecimal amount = req.getLoanAmount();
        int tenure = req.getTenure();
        String type = req.getLoanType().trim().toLowerCase();

        int cw = scoreCreditScore(cs);
        int dw = scoreDti(income, emi0, amount, tenure);
        int iw = scoreIncome(income);
        int tw = scoreTenure(tenure);
        int lw = TYPE_SCORES.getOrDefault(type, 50);

        // Fetch bounce count from request if injected
        int bounceCount = req.getBounceCount() != null ? req.getBounceCount() : 0;
        int bw = bounceCount == 0 ? 0 : bounceCount == 1 ? 20 : bounceCount == 2 ? 50 : 100;

        // Bounces heavily penalize the risk score
        int risk = clamp((int) Math.round(cw * .30 + dw * .30 + iw * .15 + tw * .10 + lw * .05 + bw * .10), 0, 100);
        String band = risk <= 20 ? "LOW" : risk <= 40 ? "MODERATE" : risk <= 60 ? "ELEVATED" : risk <= 80 ? "HIGH" : "VERY_HIGH";
        boolean ok = risk <= 60 && cs >= 500 && bounceCount <= 2;
        String reason = ok ? "Applicant meets minimum credit and DTI thresholds."
                : bounceCount > 2 ? "Too many cheque/ECS bounces detected in bank statement."
                : cs < 500 ? "Credit score below minimum threshold of 500." : "Risk score exceeds acceptable limit.";

        BigDecimal maxAmt = maxEligible(income, emi0, tenure);
        BigDecimal recEmi = emi(ok ? amount.min(maxAmt) : BigDecimal.ZERO, tenure);

        return new ScoringResult(risk, band, ok, reason, maxAmt, recEmi,
                new PredictionResponse.Breakdown(cw, dw, iw, tw, lw));
    }

    private int scoreCreditScore(int c) {
        if (c >= 800) return 5; if (c >= 750) return 15; if (c >= 700) return 30;
        if (c >= 650) return 50; if (c >= 550) return 70; return 90;
    }

    private int scoreDti(BigDecimal inc, BigDecimal e0, BigDecimal amt, int t) {
        if (inc.signum() <= 0) return 100;
        BigDecimal ratio = e0.add(emi(amt, t)).divide(inc, 4, RoundingMode.HALF_UP);
        if (ratio.compareTo(new BigDecimal("0.25")) <= 0) return 10;
        if (ratio.compareTo(new BigDecimal("0.35")) <= 0) return 25;
        if (ratio.compareTo(SAFE_DTI) <= 0) return 40;
        if (ratio.compareTo(MAX_DTI) <= 0) return 65;
        return 90;
    }

    private int scoreIncome(BigDecimal i) {
        if (i.compareTo(new BigDecimal("100000")) >= 0) return 5;
        if (i.compareTo(new BigDecimal("50000")) >= 0) return 20;
        if (i.compareTo(new BigDecimal("25000")) >= 0) return 40;
        if (i.compareTo(new BigDecimal("15000")) >= 0) return 60;
        return 85;
    }

    private int scoreTenure(int m) {
        if (m <= 36) return 10; if (m <= 60) return 20; if (m <= 120) return 35;
        if (m <= 240) return 55; return 75;
    }

    private BigDecimal maxEligible(BigDecimal inc, BigDecimal e0, int t) {
        BigDecimal avail = inc.multiply(SAFE_DTI).subtract(e0);
        if (avail.signum() <= 0) return BigDecimal.ZERO;
        double r = ANNUAL_RATE.doubleValue() / 12;
        double fac = (1 - Math.pow(1 + r, -t)) / r;
        return avail.multiply(BigDecimal.valueOf(fac)).setScale(2, RoundingMode.HALF_UP);
    }

    BigDecimal emi(BigDecimal p, int t) {
        if (p.signum() <= 0 || t <= 0) return BigDecimal.ZERO;
        double r = ANNUAL_RATE.doubleValue() / 12, pr = p.doubleValue(), pw = Math.pow(1 + r, t);
        return BigDecimal.valueOf(pr * r * pw / (pw - 1)).setScale(2, RoundingMode.HALF_UP);
    }

    private int clamp(int v, int lo, int hi) { return Math.max(lo, Math.min(hi, v)); }

    public record ScoringResult(int riskScore, String riskBand, boolean eligible,
            String eligibilityReason, BigDecimal maxEligibleAmount,
            BigDecimal recommendedEmi, PredictionResponse.Breakdown breakdown) {}
}
