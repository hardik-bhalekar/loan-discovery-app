package com.loandiscovery.controller;

import com.loandiscovery.service.KycService;
import java.util.Map;
import java.util.regex.Pattern;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/kyc")
public class KycController {

    private static final Pattern PHONE_PATTERN = Pattern.compile("^[0-9]{10,15}$");
    private static final Pattern OTP_PATTERN = Pattern.compile("^[0-9]{6}$");
    private static final Pattern PAN_PATTERN = Pattern.compile("^[A-Z]{5}[0-9]{4}[A-Z]$");

    private final KycService kycService;

    public KycController(KycService kycService) {
        this.kycService = kycService;
    }

    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtp(@RequestBody Map<String, String> payload) {
        String phone = payload.get("phone");
        if (phone == null || !PHONE_PATTERN.matcher(phone).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid phone number format");
        }
        kycService.sendOtp(phone);
        return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, String>> verifyOtp(@RequestBody Map<String, String> payload) {
        String phone = payload.get("phone");
        String otp = payload.get("otp");
        if (phone == null || !PHONE_PATTERN.matcher(phone).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid phone number format");
        }
        if (otp == null || !OTP_PATTERN.matcher(otp).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid OTP format");
        }
        kycService.verifyOtp(phone, otp);
        return ResponseEntity.ok(Map.of("message", "OTP verified successfully"));
    }

    @PostMapping("/verify-pan")
    public ResponseEntity<Map<String, String>> verifyPan(@RequestBody Map<String, String> payload) {
        String pan = payload.get("panNumber");
        if (pan == null || !PAN_PATTERN.matcher(pan).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid PAN format");
        }
        kycService.submitPan(pan);
        return ResponseEntity.ok(Map.of("message", "PAN verified and KYC updated successfully"));
    }
}
