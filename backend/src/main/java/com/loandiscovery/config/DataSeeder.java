package com.loandiscovery.config;

import com.loandiscovery.service.IfscService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final IfscService ifscService;

    // One representative IFSC per top bank for initial cache seeding
    private static final List<String> SEED_IFSCS = List.of(
            "SBIN0001234",  // State Bank of India
            "HDFC0000001",  // HDFC Bank
            "ICIC0000001",  // ICICI Bank
            "UTIB0000001",  // Axis Bank
            "KKBK0000001",  // Kotak Mahindra Bank
            "BARB0DBPATN",  // Bank of Baroda
            "PUNB0001000",  // Punjab National Bank
            "CNRB0000001",  // Canara Bank
            "IDFB0040101",  // IDFC First Bank
            "AUBL0002001"   // AU Small Finance Bank
    );

    public DataSeeder(IfscService ifscService) {
        this.ifscService = ifscService;
    }

    @Override
    public void run(String... args) {
        log.info("🏦 Seeding top bank branches...");
        int success = 0;
        for (String ifsc : SEED_IFSCS) {
            try {
                ifscService.lookup(ifsc);
                success++;
                log.info("  ✓ Seeded {}", ifsc);
            } catch (Exception e) {
                log.warn("  ✗ Failed to seed {}: {}", ifsc, e.getMessage());
            }
        }
        log.info("🏦 Seeding complete: {}/{} banks cached", success, SEED_IFSCS.size());
    }
}
