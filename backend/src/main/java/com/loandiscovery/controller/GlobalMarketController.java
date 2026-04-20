package com.loandiscovery.controller;

import com.loandiscovery.dto.GlobalMarketHotspotResponse;
import com.loandiscovery.service.GlobalMarketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/global-market")
public class GlobalMarketController {

    private final GlobalMarketService globalMarketService;

    public GlobalMarketController(GlobalMarketService globalMarketService) {
        this.globalMarketService = globalMarketService;
    }

    @GetMapping("/hotspots")
    public ResponseEntity<List<GlobalMarketHotspotResponse>> getHotspots(
            @RequestParam(value = "continent", required = false) String continent,
            @RequestParam(value = "country", required = false) String country,
            @RequestParam(value = "metric", required = false) String metric,
            @RequestParam(value = "min", required = false) Double min,
            @RequestParam(value = "max", required = false) Double max,
            @RequestParam(value = "limit", required = false) Integer limit
    ) {
        return ResponseEntity.ok(globalMarketService.getHotspots(continent, country, metric, min, max, limit));
    }
}