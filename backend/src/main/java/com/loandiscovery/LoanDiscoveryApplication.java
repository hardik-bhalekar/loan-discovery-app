package com.loandiscovery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LoanDiscoveryApplication {
    public static void main(String[] args) {
        SpringApplication.run(LoanDiscoveryApplication.class, args);
    }
}
