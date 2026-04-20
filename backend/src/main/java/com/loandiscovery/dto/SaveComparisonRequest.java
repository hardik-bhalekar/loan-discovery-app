package com.loandiscovery.dto;

import jakarta.validation.constraints.NotNull;

public class SaveComparisonRequest {

    @NotNull(message = "selectedLoans is required")
    private Object selectedLoans;

    public Object getSelectedLoans() {
        return selectedLoans;
    }

    public void setSelectedLoans(Object selectedLoans) {
        this.selectedLoans = selectedLoans;
    }
}
