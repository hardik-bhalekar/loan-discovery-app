package com.loandiscovery.controller;

import com.loandiscovery.entity.StatementReport;
import com.loandiscovery.service.StatementService;
import java.util.Set;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/statements")
public class StatementController {

    private static final long MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "application/pdf",
            "text/csv",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    private final StatementService statementService;

    public StatementController(StatementService statementService) {
        this.statementService = statementService;
    }

    @PostMapping("/upload")
    public ResponseEntity<StatementReport> uploadStatement(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (file.getSize() > MAX_UPLOAD_BYTES) {
            return ResponseEntity.badRequest().build();
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(statementService.analyzeStatement(file));
    }

    @GetMapping("/latest")
    public ResponseEntity<StatementReport> getLatest() {
        StatementReport report = statementService.getLatestReport();
        if (report == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(report);
    }
}
