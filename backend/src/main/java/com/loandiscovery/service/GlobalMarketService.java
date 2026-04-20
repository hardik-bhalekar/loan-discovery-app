package com.loandiscovery.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.loandiscovery.dto.GlobalMarketHotspotResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.OptionalDouble;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Stream;

@Service
public class GlobalMarketService {

    private static final String INFLATION_INDICATOR = "FP.CPI.TOTL.ZG";
    private static final String LENDING_RATE_INDICATOR = "FR.INR.LEND";
    private static final Duration LIVE_MACRO_CACHE_TTL = Duration.ofMinutes(30);
    private static final int DEFAULT_LIMIT = 200;

    private final List<SeededHotspot> seededHotspots;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final Map<String, LiveMacroSnapshot> macroCache;

    public GlobalMarketService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
        this.macroCache = new ConcurrentHashMap<>();

        this.seededHotspots = List.of(
                seeded("New York", "United States", "US", "North America", 40.7128, -74.0060, 6.82, 11.40, 8.30, 9.60, 5.50, 3.20, "USD", "Rates steady as inflation cools", List.of("JPMorgan Chase", "Bank of America", "Wells Fargo")),
                seeded("Toronto", "Canada", "CA", "North America", 43.6532, -79.3832, 5.35, 9.10, 7.20, 8.70, 5.00, 2.90, "CAD", "Mortgage momentum improving", List.of("RBC", "TD", "Scotiabank")),
                seeded("Sao Paulo", "Brazil", "BR", "South America", -23.5505, -46.6333, 9.45, 28.40, 19.30, 17.80, 10.50, 4.70, "BRL", "Credit demand strong despite tight policy", List.of("Itaú", "Bradesco", "Banco do Brasil")),
                seeded("London", "United Kingdom", "GB", "Europe", 51.5074, -0.1278, 5.88, 8.90, 6.80, 8.40, 5.25, 3.10, "GBP", "Housing credit stabilizing", List.of("HSBC", "Barclays", "Lloyds")),
                seeded("Frankfurt", "Germany", "DE", "Europe", 50.1109, 8.6821, 4.12, 7.60, 5.90, 6.80, 4.50, 2.60, "EUR", "Policy easing expectations rising", List.of("Deutsche Bank", "Commerzbank", "DZ Bank")),
                seeded("Istanbul", "Turkey", "TR", "Europe", 41.0082, 28.9784, 37.20, 49.50, 42.80, 44.60, 45.00, 39.80, "TRY", "High rates with inflation risk", List.of("Ziraat Bank", "Akbank", "Garanti BBVA")),
                seeded("Lagos", "Nigeria", "NG", "Africa", 6.5244, 3.3792, 24.30, 34.20, 28.10, 26.80, 24.75, 31.40, "NGN", "Liquidity pressure in retail lending", List.of("Access Bank", "GTBank", "UBA")),
                seeded("Johannesburg", "South Africa", "ZA", "Africa", -26.2041, 28.0473, 11.90, 16.80, 13.40, 14.70, 8.25, 5.40, "ZAR", "Consumer credit remains resilient", List.of("Standard Bank", "Absa", "Nedbank")),
                seeded("Cairo", "Egypt", "EG", "Africa", 30.0444, 31.2357, 21.70, 31.00, 24.90, 25.80, 27.25, 24.50, "EGP", "Policy restrictive, corporate demand mixed", List.of("NBE", "Banque Misr", "CIB")),
                seeded("Dubai", "United Arab Emirates", "AE", "Asia", 25.2048, 55.2708, 5.10, 7.90, 6.10, 7.40, 5.40, 2.80, "AED", "Real estate lending remains active", List.of("Emirates NBD", "ADCB", "Mashreq")),
                seeded("Mumbai", "India", "IN", "Asia", 19.0760, 72.8777, 8.55, 11.60, 9.35, 10.20, 6.50, 4.90, "INR", "Retail growth driven by housing", List.of("HDFC Bank", "ICICI Bank", "SBI")),
                seeded("Singapore", "Singapore", "SG", "Asia", 1.3521, 103.8198, 3.45, 5.80, 4.40, 5.20, 3.65, 2.40, "SGD", "Low inflation supports credit quality", List.of("DBS", "OCBC", "UOB")),
                seeded("Tokyo", "Japan", "JP", "Asia", 35.6762, 139.6503, 1.45, 4.20, 2.30, 3.70, 0.75, 1.70, "JPY", "Normalization phase for rates", List.of("MUFG", "SMBC", "Mizuho")),
                seeded("Seoul", "South Korea", "KR", "Asia", 37.5665, 126.9780, 3.80, 6.40, 4.90, 5.60, 3.50, 2.90, "KRW", "Household deleveraging continues", List.of("KB Kookmin", "Shinhan", "Hana Bank")),
                seeded("Sydney", "Australia", "AU", "Oceania", -33.8688, 151.2093, 6.12, 10.10, 7.40, 8.60, 4.35, 3.40, "AUD", "Housing affordability under pressure", List.of("CBA", "Westpac", "ANZ")),
                seeded("Auckland", "New Zealand", "NZ", "Oceania", -36.8509, 174.7645, 6.55, 11.20, 8.30, 9.20, 5.50, 3.60, "NZD", "Tight policy weighing on demand", List.of("ANZ NZ", "ASB", "BNZ")),
                seeded("Mexico City", "Mexico", "MX", "North America", 19.4326, -99.1332, 10.20, 26.00, 18.70, 16.90, 10.00, 4.60, "MXN", "Consumer lending still elevated", List.of("BBVA Mexico", "Banorte", "Santander Mexico")),
                seeded("Santiago", "Chile", "CL", "South America", -33.4489, -70.6693, 5.95, 15.20, 10.10, 9.80, 5.75, 3.80, "CLP", "Credit costs easing gradually", List.of("Banco de Chile", "BancoEstado", "Santander Chile"))
        );
    }

    public List<GlobalMarketHotspotResponse> getHotspots() {
        return getHotspots(null, null, null, null, null, null);
    }

    public List<GlobalMarketHotspotResponse> getHotspots(
            String continent,
            String country,
            String metric,
            Double min,
            Double max,
            Integer limit
    ) {
        String normalizedMetric = normalizeMetric(metric);
        int rowLimit = limit == null ? DEFAULT_LIMIT : Math.max(1, Math.min(limit, 500));

        Stream<GlobalMarketHotspotResponse> stream = seededHotspots.stream()
                .filter(item -> matchesText(item.continent(), continent))
                .filter(item -> matchesText(item.country(), country))
                .map(this::withLiveMetrics)
                .filter(item -> withinMetricRange(item, normalizedMetric, min, max));

        return stream.limit(rowLimit).toList();
    }

    private GlobalMarketHotspotResponse withLiveMetrics(SeededHotspot base) {
        LiveMacroSnapshot liveMacro = resolveLiveMacro(base);

        double inflation = liveMacro.inflation() != null ? liveMacro.inflation() : base.inflation();
        double policyRate = liveMacro.policyRate() != null ? liveMacro.policyRate() : base.policyRate();
        double policyDelta = policyRate - base.policyRate();
        double inflationDelta = inflation - base.inflation();

        double mortgageRate = clampRate(base.mortgageRate() + (policyDelta * 0.55) + (inflationDelta * 0.20));
        double personalLoan = clampRate(base.personalLoan() + (policyDelta * 0.72) + (inflationDelta * 0.35));
        double autoLoan = clampRate(base.autoLoan() + (policyDelta * 0.64) + (inflationDelta * 0.26));
        double businessLoan = clampRate(base.businessLoan() + (policyDelta * 0.68) + (inflationDelta * 0.30));

        return new GlobalMarketHotspotResponse(
                base.city(),
                base.country(),
                base.lat(),
                base.lng(),
                mortgageRate,
                personalLoan,
                autoLoan,
                businessLoan,
                policyRate,
                inflation,
                base.currency(),
                base.trend(),
                base.banks(),
                LocalDateTime.now().withSecond(0).withNano(0)
        );
    }

    private LiveMacroSnapshot resolveLiveMacro(SeededHotspot base) {
        LiveMacroSnapshot cached = macroCache.get(base.countryCode());
        LocalDateTime now = LocalDateTime.now();

        if (cached != null && Duration.between(cached.fetchedAt(), now).compareTo(LIVE_MACRO_CACHE_TTL) < 0) {
            return cached;
        }

        Double inflation = fetchLatestWorldBankMetric(base.countryCode(), INFLATION_INDICATOR).orElse(base.inflation());
        Double policyProxy = fetchLatestWorldBankMetric(base.countryCode(), LENDING_RATE_INDICATOR).orElse(base.policyRate());

        LiveMacroSnapshot snapshot = new LiveMacroSnapshot(inflation, policyProxy, now);
        macroCache.put(base.countryCode(), snapshot);
        return snapshot;
    }

    private OptionalDouble fetchLatestWorldBankMetric(String countryCode, String indicator) {
        String url = "https://api.worldbank.org/v2/country/" + countryCode
                + "/indicator/" + indicator + "?format=json&per_page=8";

        try {
            String payload = restTemplate.getForObject(url, String.class);
            if (payload == null || payload.isBlank()) {
                return OptionalDouble.empty();
            }

            JsonNode root = objectMapper.readTree(payload);
            JsonNode dataArray = root.path(1);
            if (!dataArray.isArray()) {
                return OptionalDouble.empty();
            }

            for (JsonNode entry : dataArray) {
                JsonNode value = entry.get("value");
                if (value != null && value.isNumber()) {
                    return OptionalDouble.of(value.asDouble());
                }
            }

            return OptionalDouble.empty();
        } catch (Exception ignored) {
            return OptionalDouble.empty();
        }
    }

    private boolean matchesText(String value, String query) {
        if (query == null || query.isBlank()) {
            return true;
        }
        return value.toLowerCase(Locale.ROOT).contains(query.toLowerCase(Locale.ROOT));
    }

    private String normalizeMetric(String metric) {
        if (metric == null || metric.isBlank()) {
            return "";
        }

        return switch (metric.trim().toLowerCase(Locale.ROOT)) {
            case "mortgage", "mortgagerate" -> "mortgageRate";
            case "personal", "personalloan" -> "personalLoan";
            case "auto", "autoloan" -> "autoLoan";
            case "business", "businessloan" -> "businessLoan";
            case "policy", "policyrate" -> "policyRate";
            case "inflation" -> "inflation";
            default -> "";
        };
    }

    private boolean withinMetricRange(GlobalMarketHotspotResponse item, String metric, Double min, Double max) {
        if (metric.isBlank()) {
            return true;
        }

        double value = switch (metric) {
            case "mortgageRate" -> item.getMortgageRate();
            case "personalLoan" -> item.getPersonalLoan();
            case "autoLoan" -> item.getAutoLoan();
            case "businessLoan" -> item.getBusinessLoan();
            case "policyRate" -> item.getPolicyRate();
            case "inflation" -> item.getInflation();
            default -> Double.NaN;
        };

        if (Double.isNaN(value)) {
            return true;
        }
        if (min != null && value < min) {
            return false;
        }
        if (max != null && value > max) {
            return false;
        }
        return true;
    }

    private double clampRate(double value) {
        return Math.max(0.10, Math.min(75.00, value));
    }

    private SeededHotspot seeded(
            String city,
            String country,
            String countryCode,
            String continent,
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
            List<String> banks
    ) {
        return new SeededHotspot(
                city,
                country,
                countryCode,
                continent,
                lat,
                lng,
                mortgageRate,
                personalLoan,
                autoLoan,
                businessLoan,
                policyRate,
                inflation,
                currency,
                trend,
                banks
        );
    }

            private record SeededHotspot(
                String city,
                String country,
                String countryCode,
                String continent,
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
                List<String> banks
            ) {
            }

            private record LiveMacroSnapshot(
                Double inflation,
                Double policyRate,
                LocalDateTime fetchedAt
            ) {
            }
}