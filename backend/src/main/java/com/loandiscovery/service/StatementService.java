package com.loandiscovery.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loandiscovery.entity.StatementReport;
import com.loandiscovery.model.User;
import com.loandiscovery.repository.StatementReportRepository;
import com.loandiscovery.security.CurrentUserService;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class StatementService {
    private static final Logger log = LoggerFactory.getLogger(StatementService.class);
    
    private final StatementReportRepository repository;
    private final CurrentUserService currentUserService;
    private final ObjectMapper objectMapper;

    public StatementService(StatementReportRepository repository, CurrentUserService currentUserService, ObjectMapper objectMapper) {
        this.repository = repository;
        this.currentUserService = currentUserService;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public StatementReport analyzeStatement(MultipartFile file) {
        User user = currentUserService.getCurrentUserEntity();
        log.info("Analyzing bank statement {} for user {}", file.getOriginalFilename(), user.getId());

        // Mock statement analysis logic extracting features
        Random rnd = new Random();
        BigDecimal avgIncome = new BigDecimal(50000 + rnd.nextInt(50000));
        BigDecimal detectedEmi = new BigDecimal(5000 + rnd.nextInt(10000));
        int bounces = rnd.nextInt(3); // 0 to 2 bounces

        List<Map<String, Object>> cashflows = List.of(
            Map.of("month", "Jan", "inflow", avgIncome.subtract(new BigDecimal("1000")), "outflow", avgIncome.multiply(new BigDecimal("0.8"))),
            Map.of("month", "Feb", "inflow", avgIncome.add(new BigDecimal("2000")), "outflow", avgIncome.multiply(new BigDecimal("0.7"))),
            Map.of("month", "Mar", "inflow", avgIncome, "outflow", avgIncome.multiply(new BigDecimal("0.85")))
        );

        String json = "[]";
        try {
            json = objectMapper.writeValueAsString(cashflows);
        } catch (Exception e) {
            log.error("Failed to serialize cashflows", e);
        }

        StatementReport report = new StatementReport();
        report.setUserId(user.getId());
        report.setAverageMonthlyIncome(avgIncome);
        report.setTotalDetectedEmis(detectedEmi);
        report.setBounceCount(bounces);
        report.setCashflowJson(json);
        report.setUploadedAt(LocalDateTime.now());

        return repository.save(report);
    }

    @Transactional(readOnly = true)
    public StatementReport getLatestReport() {
        User user = currentUserService.getCurrentUserEntity();
        return repository.findTopByUserIdOrderByUploadedAtDesc(user.getId()).orElse(null);
    }
}
