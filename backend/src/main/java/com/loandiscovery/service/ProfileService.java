package com.loandiscovery.service;

import com.loandiscovery.dto.LoanProfileRequest;
import com.loandiscovery.dto.PersonalProfileRequest;
import com.loandiscovery.dto.ProfileResponse;
import com.loandiscovery.model.LoanProfile;
import com.loandiscovery.model.PersonalProfile;
import com.loandiscovery.model.User;
import com.loandiscovery.repository.LoanProfileRepository;
import com.loandiscovery.repository.PersonalProfileRepository;
import com.loandiscovery.repository.UserRepository;
import com.loandiscovery.security.CurrentUserService;
import java.math.BigDecimal;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProfileService {

    private final CurrentUserService currentUserService;
    private final UserRepository userRepository;
    private final PersonalProfileRepository personalProfileRepository;
    private final LoanProfileRepository loanProfileRepository;

    public ProfileService(
            CurrentUserService currentUserService,
            UserRepository userRepository,
            PersonalProfileRepository personalProfileRepository,
            LoanProfileRepository loanProfileRepository
    ) {
        this.currentUserService = currentUserService;
        this.userRepository = userRepository;
        this.personalProfileRepository = personalProfileRepository;
        this.loanProfileRepository = loanProfileRepository;
    }

    public ProfileResponse getMyProfile() {
        User user = currentUserService.getCurrentUserEntity();
        PersonalProfile personalProfile = personalProfileRepository.findByUserId(user.getId()).orElse(null);
        LoanProfile loanProfile = loanProfileRepository.findByUserId(user.getId()).orElse(null);
        return new ProfileResponse(user, toResponse(personalProfile), toResponse(loanProfile));
    }

    public ProfileResponse savePersonalProfile(PersonalProfileRequest request) {
        User user = currentUserService.getCurrentUserEntity();
        String email = normalizeEmail(request.getEmail());

        userRepository.findByEmail(email)
                .filter(existing -> !existing.getId().equals(user.getId()))
                .ifPresent(existing -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
                });

        user.setName(normalize(request.getName()));
        user.setEmail(email);
        user.setPhone(normalize(request.getPhone()));

        PersonalProfile personalProfile = personalProfileRepository.findByUserId(user.getId()).orElseGet(PersonalProfile::new);
        personalProfile.setUser(user);
        personalProfile.setAge(request.getAge());
        personalProfile.setGender(normalize(request.getGender()));
        personalProfile.setCity(normalize(request.getCity()));
        personalProfile.setOccupation(normalize(request.getOccupation()));

        user.setPersonalProfile(personalProfile);
        userRepository.save(user);
        return getMyProfile();
    }

    public ProfileResponse saveLoanProfile(LoanProfileRequest request) {
        User user = currentUserService.getCurrentUserEntity();

        LoanProfile loanProfile = loanProfileRepository.findByUserId(user.getId()).orElseGet(LoanProfile::new);
        loanProfile.setUser(user);
        loanProfile.setMonthlyIncome(request.getMonthlyIncome());
        loanProfile.setCreditScore(request.getCreditScore());
        loanProfile.setExistingEmi(request.getExistingEmi() != null ? request.getExistingEmi() : BigDecimal.ZERO);
        loanProfile.setLoanAmount(request.getLoanAmount());
        loanProfile.setLoanType(normalize(request.getLoanType()));
        loanProfile.setTenure(request.getTenure());
        loanProfile.setPurpose(normalize(request.getPurpose()));

        user.setLoanProfile(loanProfile);
        userRepository.save(user);
        return getMyProfile();
    }

    private ProfileResponse.PersonalProfileData toResponse(PersonalProfile personalProfile) {
        if (personalProfile == null) {
            return null;
        }

        return new ProfileResponse.PersonalProfileData(
                personalProfile.getId(),
                personalProfile.getAge(),
                personalProfile.getGender(),
                personalProfile.getCity(),
                personalProfile.getOccupation()
        );
    }

    private ProfileResponse.LoanProfileData toResponse(LoanProfile loanProfile) {
        if (loanProfile == null) {
            return null;
        }

        return new ProfileResponse.LoanProfileData(
                loanProfile.getId(),
                loanProfile.getMonthlyIncome(),
                loanProfile.getCreditScore(),
                loanProfile.getExistingEmi(),
                loanProfile.getLoanAmount(),
                loanProfile.getLoanType(),
                loanProfile.getTenure(),
                loanProfile.getPurpose()
        );
    }

    private String normalize(String value) {
        return value == null ? null : value.trim();
    }

    private String normalizeEmail(String value) {
        String normalized = normalize(value);
        return normalized == null ? null : normalized.toLowerCase();
    }
}