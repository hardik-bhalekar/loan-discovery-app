package com.loandiscovery.controller;

import com.loandiscovery.entity.UserConsent;
import com.loandiscovery.service.ConsentService;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/consent")
public class ConsentController {

    private final ConsentService consentService;

    public ConsentController(ConsentService consentService) {
        this.consentService = consentService;
    }

    @PostMapping
    public ResponseEntity<UserConsent> recordConsent(@RequestBody Map<String, String> payload, HttpServletRequest request) {
        String consentType = payload.get("consentType");
        String ip = resolveClientIp(request);
        return ResponseEntity.ok(consentService.recordConsent(consentType, ip));
    }

    @GetMapping
    public ResponseEntity<List<UserConsent>> getConsents() {
        return ResponseEntity.ok(consentService.getActiveConsents());
    }

    private String resolveClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}
