package com.loandiscovery.dto;

import java.time.LocalDateTime;

public class SavedComparisonResponse {

    private final Long id;
    private final Object selectedLoans;
    private final LocalDateTime createdAt;

    public SavedComparisonResponse(Long id, Object selectedLoans, LocalDateTime createdAt) {
        this.id = id;
        this.selectedLoans = selectedLoans;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Object getSelectedLoans() {
        return selectedLoans;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
