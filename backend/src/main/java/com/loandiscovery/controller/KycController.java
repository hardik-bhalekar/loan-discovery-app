package com.loandiscovery.controller;

import com.loandiscovery.service.KycService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/kyc")
public class KycController {

    private final KycService kycService;

    public KycController(KycService kycService) {
        this.kycService = kycService;
    }

    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtp(@RequestBody Map<String, String> payload) {
        kycService.sendOtp(payload.get("phone"));
        return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, String>> verifyOtp(@RequestBody Map<String, String> payload) {
        kycService.verifyOtp(payload.get("phone"), payload.get("otp"));
        return ResponseEntity.ok(Map.of("message", "OTP verified successfully"));
    }

    @PostMapping("/verify-pan")
    public ResponseEntity<Map<String, String>> verifyPan(@RequestBody Map<String, String> payload) {
        kycService.submitPan(payload.get("panNumber"));
        return ResponseEntity.ok(Map.of("message", "PAN verified and KYC updated successfully"));
    }
}
