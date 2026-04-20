package com.loandiscovery.controller;

import com.loandiscovery.dto.SaveComparisonRequest;
import com.loandiscovery.dto.SavedComparisonResponse;
import com.loandiscovery.service.ComparisonService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/comparisons")
public class ComparisonController {

    private final ComparisonService comparisonService;

    public ComparisonController(ComparisonService comparisonService) {
        this.comparisonService = comparisonService;
    }

    @GetMapping
    public ResponseEntity<List<SavedComparisonResponse>> listSavedComparisons() {
        return ResponseEntity.ok(comparisonService.listSavedComparisons());
    }

    @PostMapping
    public ResponseEntity<SavedComparisonResponse> saveComparison(@Valid @RequestBody SaveComparisonRequest request) {
        return ResponseEntity.ok(comparisonService.saveComparison(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComparison(@PathVariable("id") Long id) {
        comparisonService.deleteComparison(id);
        return ResponseEntity.noContent().build();
    }
}