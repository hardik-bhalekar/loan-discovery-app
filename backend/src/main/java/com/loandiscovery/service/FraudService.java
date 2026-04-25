package com.loandiscovery.service;

import com.loandiscovery.dto.PredictionRequest;
import com.loandiscovery.entity.FraudAlert;
import com.loandiscovery.entity.LoanDecision;
import com.loandiscovery.entity.OtpRecord;
import com.loandiscovery.model.User;
import com.loandiscovery.repository.FraudAlertRepository;
import com.loandiscovery.repository.LoanDecisionRepository;
import com.loandiscovery.repository.OtpRecordRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FraudService {
    private static final Logger log = LoggerFactory.getLogger(FraudService.class);

    private final FraudAlertRepository fraudAlertRepository;
    private final LoanDecisionRepository loanDecisionRepository;
    private final OtpRecordRepository otpRecordRepository;

    public FraudService(FraudAlertRepository fraudAlertRepository,
                        LoanDecisionRepository loanDecisionRepository,
                        OtpRecordRepository otpRecordRepository) {
        this.fraudAlertRepository = fraudAlertRepository;
        this.loanDecisionRepository = loanDecisionRepository;
        this.otpRecordRepository = otpRecordRepository;
    }

    @Transactional
    public List<String> detectFraud(User user, PredictionRequest request, String clientIp) {
        List<String> fraudReasons = new ArrayList<>();
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);

        // 1. Impossible income values (> 100,000,000 INR monthly)
        if (request.getMonthlyIncome() != null && request.getMonthlyIncome().compareTo(new BigDecimal("100000000")) > 0) {
            fraudReasons.add("Impossible income value detected: " + request.getMonthlyIncome());
        }

        // 2. Repeated submissions (> 5 in last hour)
        int recentSubmissions = loanDecisionRepository.countByUserIdAndDecidedAtAfter(user.getId(), oneHourAgo);
        if (recentSubmissions >= 5) {
            fraudReasons.add("Repeated submissions (" + recentSubmissions + " in last hour)");
        }

        // 3. Suspicious IP frequency (> 20 requests in last hour)
        if (clientIp != null && !clientIp.isBlank()) {
            int ipFreq = loanDecisionRepository.countByClientIpAndDecidedAtAfter(clientIp, oneHourAgo);
            if (ipFreq >= 20) {
                fraudReasons.add("Suspicious IP frequency (" + ipFreq + " requests from " + clientIp + " in last hour)");
            }
        }

        // 4. Abnormal loan amount jumps (> 10x max previous)
        Optional<LoanDecision> maxPreviousOpt = loanDecisionRepository.findTopByUserIdOrderByLoanAmountDesc(user.getId());
        if (maxPreviousOpt.isPresent() && request.getLoanAmount() != null) {
            BigDecimal maxPrev = maxPreviousOpt.get().getLoanAmount();
            if (maxPrev.compareTo(BigDecimal.ZERO) > 0 && request.getLoanAmount().compareTo(maxPrev.multiply(BigDecimal.TEN)) > 0) {
                fraudReasons.add("Abnormal loan amount jump (Requested: " + request.getLoanAmount() + ", Max Prev: " + maxPrev + ")");
            }
        }

        // 5. OTP failures (Max attempts reached without verification on latest OTP)
        if (user.getPhone() != null) {
            Optional<OtpRecord> otpOpt = otpRecordRepository.findTopByIdentifierOrderByExpiresAtDesc(user.getPhone());
            if (otpOpt.isPresent()) {
                OtpRecord otp = otpOpt.get();
                if (!otp.isVerified() && otp.getAttempts() >= 3) {
                    fraudReasons.add("Suspicious OTP activity (Multiple failures on latest OTP)");
                }
            }
        }

        if (!fraudReasons.isEmpty()) {
            log.warn("Fraud detected for user {}: {}", user.getId(), String.join(", ", fraudReasons));
            FraudAlert alert = new FraudAlert();
            alert.setUserId(user.getId());
            alert.setIpAddress(clientIp);
            alert.setReason(String.join(" | ", fraudReasons));
            alert.setCreatedAt(LocalDateTime.now());
            alert.setResolved(false);
            fraudAlertRepository.save(alert);
        }

        return fraudReasons;
    }

    @Transactional(readOnly = true)
    public List<FraudAlert> getUnresolvedAlerts() {
        return fraudAlertRepository.findByResolvedFalseOrderByCreatedAtDesc();
    }
}
