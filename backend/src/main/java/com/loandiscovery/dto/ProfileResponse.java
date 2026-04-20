package com.loandiscovery.dto;

import com.loandiscovery.model.User;

public class ProfileResponse {

    private final Long userId;
    private final String name;
    private final String email;
    private final String phone;
    private final PersonalProfileData personal;
    private final LoanProfileData loan;

    public ProfileResponse(User user, PersonalProfileData personal, LoanProfileData loan) {
        this.userId = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.personal = personal;
        this.loan = loan;
    }

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public PersonalProfileData getPersonal() {
        return personal;
    }

    public LoanProfileData getLoan() {
        return loan;
    }

    public record PersonalProfileData(Long id, Integer age, String gender, String city, String occupation) {
    }

    public record LoanProfileData(
            Long id,
            java.math.BigDecimal monthlyIncome,
            Integer creditScore,
            java.math.BigDecimal existingEmi,
            java.math.BigDecimal loanAmount,
            String loanType,
            Integer tenure,
            String purpose
    ) {
    }
}
