package com.loandiscovery.controller;

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

    public ComplianceController(ComplianceService complianceService) {
        this.complianceService = complianceService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> exportData() {
        return ResponseEntity.ok(complianceService.exportUserData());
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAccountData(HttpServletRequest request) {
        String clientIp = resolveClientIp(request);
        complianceService.deleteUserData(clientIp);
        return ResponseEntity.noContent().build();
    }

    private String resolveClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}
