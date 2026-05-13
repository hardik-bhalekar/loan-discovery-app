package com.loandiscovery.service;

import com.loandiscovery.model.InterestRate;
import com.loandiscovery.repository.InterestRateRepository;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Scrapes interest rate data from BankBazaar.com pages daily.
 * Parses HTML tables to extract bank-wise interest rates for various loan types
 * and persists them in the database.
 */
@Service
public class BankBazaarScraperService {

    private static final Logger log = LoggerFactory.getLogger(BankBazaarScraperService.class);

    private static final String USER_AGENT = "LoanDiscoveryBot/1.0 (Educational Project; +https://github.com/loan-discovery)";
    private static final int CONNECT_TIMEOUT_MS = 15000;
    private static final int DELAY_BETWEEN_PAGES_MS = 2000;

    /** Regex to extract numeric rate values like "7.10", "8.55", etc. */
    private static final Pattern RATE_PATTERN = Pattern.compile("(\\d{1,2}\\.\\d{1,2})\\s*%");

    /** Pages to scrape mapped to their loan types */
    private static final Map<String, String> SCRAPE_TARGETS = Map.of(
        "https://www.bankbazaar.com/home-loan-interest-rate.html", "Home Loan",
        "https://www.bankbazaar.com/personal-loan-interest-rate.html", "Personal Loan",
        "https://www.bankbazaar.com/car-loan-interest-rate.html", "Car Loan",
        "https://www.bankbazaar.com/education-loan-interest-rate.html", "Education Loan"
    );

    private final InterestRateRepository interestRateRepository;

    public BankBazaarScraperService(InterestRateRepository interestRateRepository) {
        this.interestRateRepository = interestRateRepository;
    }

    /**
     * Scheduled daily scrape at 6:00 AM IST.
     * Also runs once on startup if no data exists.
     */
    @Scheduled(cron = "0 0 6 * * *", zone = "Asia/Kolkata")
    public void scheduledScrape() {
        log.info("Starting scheduled BankBazaar interest rate scrape...");
        scrapeAllRates();
    }

    /**
     * Run an initial scrape on startup if the database has no rates.
     */
    @jakarta.annotation.PostConstruct
    public void initialScrapeIfEmpty() {
        if (interestRateRepository.countByIsLatestTrue() == 0) {
            log.info("No interest rates in database. Running initial scrape...");
            scrapeAllRates();
        }
    }

    /**
     * Public method to trigger a manual scrape (e.g., from admin endpoint).
     */
    @Transactional
    public int scrapeAllRates() {
        List<InterestRate> allScrapedRates = new ArrayList<>();
        LocalDateTime scrapeTime = LocalDateTime.now();

        for (Map.Entry<String, String> target : SCRAPE_TARGETS.entrySet()) {
            String url = target.getKey();
            String loanType = target.getValue();

            try {
                log.info("Scraping {} rates from: {}", loanType, url);
                List<InterestRate> rates = scrapePage(url, loanType, scrapeTime);
                allScrapedRates.addAll(rates);
                log.info("Extracted {} {} rates", rates.size(), loanType);

                // Be polite — wait between requests
                Thread.sleep(DELAY_BETWEEN_PAGES_MS);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                log.warn("Scraping interrupted");
                break;
            } catch (Exception e) {
                log.error("Failed to scrape {} from {}: {}", loanType, url, e.getMessage());
            }
        }

        if (!allScrapedRates.isEmpty()) {
            // Mark old records as not latest, then save new ones
            interestRateRepository.markAllAsNotLatest();
            interestRateRepository.saveAll(allScrapedRates);
            log.info("Successfully saved {} scraped interest rates", allScrapedRates.size());
        } else {
            log.warn("No rates were scraped — keeping existing data");
        }

        return allScrapedRates.size();
    }

    /**
     * Scrapes a single BankBazaar page and extracts interest rate data from the HTML tables.
     */
    private List<InterestRate> scrapePage(String url, String loanType, LocalDateTime scrapeTime) throws Exception {
        Document doc = Jsoup.connect(url)
                .userAgent(USER_AGENT)
                .timeout(CONNECT_TIMEOUT_MS)
                .referrer("https://www.google.com")
                .header("Accept-Language", "en-US,en;q=0.9")
                .get();

        List<InterestRate> rates = new ArrayList<>();

        // BankBazaar uses <table> elements to list rates. Try multiple table selectors.
        Elements tables = doc.select("table");

        for (Element table : tables) {
            Elements rows = table.select("tr");
            for (Element row : rows) {
                Elements cells = row.select("td");
                if (cells.size() < 2) {
                    continue;
                }

                // First cell typically contains the bank name (often as a link)
                String bankName = extractBankName(cells.get(0));
                if (bankName == null || bankName.isBlank()) {
                    continue;
                }

                // Extract the bank's detail page URL from the anchor tag
                String bankPageUrl = extractBankPageUrl(cells.get(0));

                // Second cell typically has the interest rate
                String rateText = cells.get(1).text();
                List<Double> rateValues = extractRates(rateText);
                if (rateValues.isEmpty()) {
                    continue;
                }

                // Determine rate type from the text
                String rateType = determineRateType(rateText);

                // Third cell (if exists) has processing fee info
                String processingFee = cells.size() >= 3 ? cells.get(2).text().trim() : "";
                if (processingFee.length() > 500) {
                    processingFee = processingFee.substring(0, 500);
                }

                InterestRate rate = new InterestRate();
                rate.setBankName(cleanBankName(bankName));
                rate.setLoanType(loanType);
                rate.setInterestRateMin(rateValues.get(0));
                rate.setInterestRateMax(rateValues.size() > 1 ? rateValues.get(1) : null);
                rate.setRateType(rateType);
                rate.setProcessingFee(processingFee);
                rate.setSourceUrl(url);
                rate.setBankPageUrl(bankPageUrl);
                rate.setScrapedAt(scrapeTime);
                rate.setIsLatest(true);

                rates.add(rate);
            }
        }

        return rates;
    }

    /**
     * Extracts the bank name from a table cell, preferring link text.
     */
    private String extractBankName(Element cell) {
        // Try to get bank name from anchor tag first
        Element link = cell.selectFirst("a");
        if (link != null) {
            String text = link.text().trim();
            if (!text.isBlank()) {
                return text;
            }
        }
        // Fallback to cell text
        return cell.text().trim();
    }

    /**
     * Extracts the bank's BankBazaar detail page URL from the anchor tag in a cell.
     * Returns null if no link is found.
     */
    private String extractBankPageUrl(Element cell) {
        Element link = cell.selectFirst("a[href]");
        if (link == null) {
            return null;
        }
        String href = link.attr("abs:href").trim();
        if (href.isEmpty()) {
            href = link.attr("href").trim();
            if (!href.isEmpty() && !href.startsWith("http")) {
                href = "https://www.bankbazaar.com" + (href.startsWith("/") ? "" : "/") + href;
            }
        }
        return href.isEmpty() ? null : href;
    }

    /**
     * Cleans up bank names by removing common suffixes.
     */
    private String cleanBankName(String name) {
        if (name == null) return "";
        return name
                .replaceAll("\\s+Home Loan[s]?$", "")
                .replaceAll("\\s+Personal Loan[s]?$", "")
                .replaceAll("\\s+Car Loan[s]?$", "")
                .replaceAll("\\s+Education Loan[s]?$", "")
                .replaceAll("\\s+", " ")
                .trim();
    }

    /**
     * Extracts all percentage rate values from a text string.
     * Returns sorted list of rate values.
     */
    private List<Double> extractRates(String text) {
        List<Double> rates = new ArrayList<>();
        Matcher matcher = RATE_PATTERN.matcher(text);
        while (matcher.find()) {
            try {
                double value = Double.parseDouble(matcher.group(1));
                if (value > 0.0 && value < 100.0) {
                    rates.add(value);
                }
            } catch (NumberFormatException ignored) {
                // Skip malformed numbers
            }
        }
        rates.sort(Double::compareTo);
        return rates;
    }

    /**
     * Determines if the rate is floating or fixed based on the text context.
     */
    private String determineRateType(String text) {
        String lower = text.toLowerCase();
        if (lower.contains("fixed") && lower.contains("floating")) {
            return "both";
        } else if (lower.contains("fixed")) {
            return "fixed";
        } else if (lower.contains("floating")) {
            return "floating";
        }
        return "floating"; // default for most Indian bank loans
    }
}
