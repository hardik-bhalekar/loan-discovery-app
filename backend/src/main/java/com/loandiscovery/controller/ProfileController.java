package com.loandiscovery.controller;

import com.loandiscovery.dto.LoanProfileRequest;
import com.loandiscovery.dto.PersonalProfileRequest;
import com.loandiscovery.dto.ProfileResponse;
import com.loandiscovery.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile() {
        return ResponseEntity.ok(profileService.getMyProfile());
    }

    @PutMapping("/personal")
    public ResponseEntity<ProfileResponse> savePersonalProfile(@Valid @RequestBody PersonalProfileRequest request) {
        return ResponseEntity.ok(profileService.savePersonalProfile(request));
    }

    @PutMapping("/loan")
    public ResponseEntity<ProfileResponse> saveLoanProfile(@Valid @RequestBody LoanProfileRequest request) {
        return ResponseEntity.ok(profileService.saveLoanProfile(request));
    }
}