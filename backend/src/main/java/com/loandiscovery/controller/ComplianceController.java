package com.loandiscovery.controller;

import com.loandiscovery.security.ClientIpResolver;
import com.loandiscovery.service.ComplianceService;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/account/data")
public class ComplianceController {

    private final ComplianceService complianceService;
    private final ClientIpResolver clientIpResolver;

    public ComplianceController(ComplianceService complianceService, ClientIpResolver clientIpResolver) {
        this.complianceService = complianceService;
        this.clientIpResolver = clientIpResolver;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> exportData() {
        return ResponseEntity.ok(complianceService.exportUserData());
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAccountData(HttpServletRequest request) {
        String clientIp = clientIpResolver.resolve(request);
        complianceService.deleteUserData(clientIp);
        return ResponseEntity.noContent().build();
    }
}
