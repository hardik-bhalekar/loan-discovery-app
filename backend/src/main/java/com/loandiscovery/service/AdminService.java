package com.loandiscovery.service;

import com.loandiscovery.dto.AdminStatsResponse;
import com.loandiscovery.model.LoanProfile;
import com.loandiscovery.model.User;
import com.loandiscovery.repository.LoanProfileRepository;
import com.loandiscovery.repository.SavedComparisonRepository;
import com.loandiscovery.repository.UserRepository;
import com.loandiscovery.security.CurrentUserService;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminService {

    private final CurrentUserService currentUserService;
    private final UserRepository userRepository;
    private final LoanProfileRepository loanProfileRepository;
    private final SavedComparisonRepository savedComparisonRepository;
    private final String adminEmail;

    public AdminService(
            CurrentUserService currentUserService,
            UserRepository userRepository,
            LoanProfileRepository loanProfileRepository,
            SavedComparisonRepository savedComparisonRepository,
            @Value("${app.admin.email}") String adminEmail
    ) {
        this.currentUserService = currentUserService;
        this.userRepository = userRepository;
        this.loanProfileRepository = loanProfileRepository;
        this.savedComparisonRepository = savedComparisonRepository;
        this.adminEmail = adminEmail;
    }

    public AdminStatsResponse getStats() {
        User currentUser = currentUserService.getCurrentUserEntity();
        if (currentUser.getEmail() == null || !currentUser.getEmail().equalsIgnoreCase(adminEmail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required");
        }

        List<LoanProfile> loanProfiles = loanProfileRepository.findAll();
        Map<String, Long> loanTypePopularity = loanProfiles.stream()
                .filter(profile -> profile.getLoanType() != null && !profile.getLoanType().isBlank())
                .collect(Collectors.groupingBy(LoanProfile::getLoanType, Collectors.counting()));

        BigDecimal avgLoanAmount = loanProfiles.stream()
                .map(LoanProfile::getLoanAmount)
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        if (!loanProfiles.isEmpty()) {
            avgLoanAmount = avgLoanAmount.divide(BigDecimal.valueOf(loanProfiles.size()), 2, RoundingMode.HALF_UP);
        }

        List<AdminStatsResponse.RecentSignup> recentSignups = userRepository.findTop5ByOrderByCreatedAtDesc().stream()
                .map(user -> new AdminStatsResponse.RecentSignup(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getCreatedAt()
                ))
                .toList();

        return new AdminStatsResponse(
                userRepository.count(),
                savedComparisonRepository.count(),
                loanTypePopularity.entrySet().stream()
                        .sorted(Map.Entry.<String, Long>comparingByValue(Comparator.reverseOrder()))
                        .collect(Collectors.toMap(
                                Map.Entry::getKey,
                                Map.Entry::getValue,
                                (left, right) -> left,
                                java.util.LinkedHashMap::new
                        )),
                avgLoanAmount,
                recentSignups
        );
    }
}