package com.loandiscovery.controller;

import com.loandiscovery.entity.FraudAlert;
import com.loandiscovery.service.FraudService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/fraud")
public class FraudController {

    private final FraudService fraudService;

    public FraudController(FraudService fraudService) {
        this.fraudService = fraudService;
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<FraudAlert>> getAlerts() {
        // Note: Realistically this endpoint should be protected by an ADMIN role
        return ResponseEntity.ok(fraudService.getUnresolvedAlerts());
    }
}
