package com.loandiscovery.controller;

import com.loandiscovery.dto.InterestRateResponse;
import com.loandiscovery.model.InterestRate;
import com.loandiscovery.repository.InterestRateRepository;
import com.loandiscovery.service.BankBazaarScraperService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interest-rates")
public class InterestRateController {

    private final InterestRateRepository interestRateRepository;
    private final BankBazaarScraperService scraperService;

    public InterestRateController(
            InterestRateRepository interestRateRepository,
            BankBazaarScraperService scraperService
    ) {
        this.interestRateRepository = interestRateRepository;
        this.scraperService = scraperService;
    }

    /**
     * Get all latest scraped interest rates, optionally filtered by loan type.
     */
    @GetMapping
    public ResponseEntity<List<InterestRateResponse>> getInterestRates(
            @RequestParam(value = "loanType", required = false) String loanType
    ) {
        List<InterestRate> rates;
        if (loanType != null && !loanType.isBlank()) {
            rates = interestRateRepository.findByLoanTypeAndIsLatestTrueOrderByInterestRateMinAsc(loanType);
        } else {
            rates = interestRateRepository.findByIsLatestTrueOrderByLoanTypeAscBankNameAsc();
        }

        List<InterestRateResponse> response = rates.stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(response);
    }

    /**
     * Get the timestamp of the most recent scrape.
     */
    @GetMapping("/last-updated")
    public ResponseEntity<Map<String, Object>> getLastUpdated() {
        return interestRateRepository.findFirstByIsLatestTrueOrderByScrapedAtDesc()
                .map(rate -> ResponseEntity.ok(Map.<String, Object>of(
                        "lastUpdated", rate.getScrapedAt().toString(),
                        "totalRates", interestRateRepository.countByIsLatestTrue(),
                        "loanTypes", interestRateRepository.findDistinctLoanTypes()
                )))
                .orElse(ResponseEntity.ok(Map.of(
                        "lastUpdated", "never",
                        "totalRates", 0L,
                        "loanTypes", List.of()
                )));
    }

    /**
     * Manually trigger a scrape refresh.
     */
    @GetMapping("/refresh")
    public ResponseEntity<Map<String, Object>> triggerRefresh() {
        int count = scraperService.scrapeAllRates();
        return ResponseEntity.ok(Map.of(
                "message", "Scrape completed",
                "ratesScraped", count,
                "timestamp", LocalDateTime.now().toString()
        ));
    }

    private InterestRateResponse toResponse(InterestRate rate) {
        return new InterestRateResponse(
                rate.getId(),
                rate.getBankName(),
                rate.getLoanType(),
                rate.getInterestRateMin(),
                rate.getInterestRateMax(),
                rate.getRateType(),
                rate.getProcessingFee(),
                rate.getSourceUrl(),
                rate.getBankPageUrl(),
                rate.getScrapedAt()
        );
    }
}
