package com.loandiscovery.controller;

import com.loandiscovery.dto.IfscResponse;
import com.loandiscovery.service.IfscService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BankController {

    private final IfscService ifscService;

    public BankController(IfscService ifscService) {
        this.ifscService = ifscService;
    }

    /**
     * Lookup IFSC code — cache-through to Razorpay API.
     */
    @GetMapping("/ifsc/{code}")
    public ResponseEntity<IfscResponse> lookupIfsc(@PathVariable String code) {
        IfscResponse response = ifscService.lookup(code);
        return ResponseEntity.ok(response);
    }

    /**
     * Search cached bank names by query.
     */
    @GetMapping("/banks/search")
    public ResponseEntity<List<String>> searchBanks(
            @RequestParam(value = "q", required = false, defaultValue = "") String query) {
        List<String> banks = ifscService.searchBanks(query);
        return ResponseEntity.ok(banks);
    }

    /**
     * Get cached branches by city.
     */
    @GetMapping("/banks/by-city")
    public ResponseEntity<List<IfscResponse>> getBanksByCity(
            @RequestParam("city") String city) {
        List<IfscResponse> branches = ifscService.getBanksByCity(city);
        return ResponseEntity.ok(branches);
    }

    /**
     * Get all distinct cached bank names (for dropdowns).
     */
    @GetMapping("/banks/names")
    public ResponseEntity<List<String>> getAllBankNames() {
        List<String> names = ifscService.getAllBankNames();
        return ResponseEntity.ok(names);
    }
}
