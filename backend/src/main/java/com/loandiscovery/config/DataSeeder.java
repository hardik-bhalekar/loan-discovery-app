package com.loandiscovery.config;

import com.loandiscovery.model.User;
import com.loandiscovery.repository.UserRepository;
import com.loandiscovery.service.IfscService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final IfscService ifscService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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

    public DataSeeder(IfscService ifscService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.ifscService = ifscService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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

        seedFakeUsers();
    }

    private void seedFakeUsers() {
        log.info("👤 Seeding fake users...");
        List<UserTemplate> testUsers = List.of(
            new UserTemplate("John Doe", "john@example.com", "9876543210", "password123"),
            new UserTemplate("Jane Smith", "jane@example.com", "9876543211", "password123"),
            new UserTemplate("Test User", "test@example.com", "9876543212", "password123")
        );

        for (UserTemplate template : testUsers) {
            if (userRepository.findByEmail(template.email).isEmpty()) {
                User user = new User();
                user.setName(template.name);
                user.setEmail(template.email);
                user.setPhone(template.phone);
                user.setPasswordHash(passwordEncoder.encode(template.password));
                user.setKycVerified(true);
                user.setPanNumber("ABCDE1234F"); // Fake PAN
                userRepository.save(user);
                log.info("  ✓ Created user: {}", template.email);
            } else {
                log.info("  - User already exists: {}", template.email);
            }
        }
    }

    private record UserTemplate(String name, String email, String phone, String password) {}
}
