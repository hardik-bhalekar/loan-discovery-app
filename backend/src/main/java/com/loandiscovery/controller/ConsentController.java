package com.loandiscovery.controller;

import com.loandiscovery.entity.UserConsent;
import com.loandiscovery.security.ClientIpResolver;
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
    private final ClientIpResolver clientIpResolver;

    public ConsentController(ConsentService consentService, ClientIpResolver clientIpResolver) {
        this.consentService = consentService;
        this.clientIpResolver = clientIpResolver;
    }

    @PostMapping
    public ResponseEntity<UserConsent> recordConsent(@RequestBody Map<String, String> payload, HttpServletRequest request) {
        String consentType = payload.get("consentType");
        String ip = clientIpResolver.resolve(request);
        return ResponseEntity.ok(consentService.recordConsent(consentType, ip));
    }

    @GetMapping
    public ResponseEntity<List<UserConsent>> getConsents() {
        return ResponseEntity.ok(consentService.getActiveConsents());
    }
}
