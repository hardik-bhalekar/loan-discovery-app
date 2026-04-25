package com.loandiscovery.service;

import com.loandiscovery.model.User;
import com.loandiscovery.repository.UserRepository;
import com.loandiscovery.repository.UserConsentRepository;
import com.loandiscovery.security.CurrentUserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class ComplianceService {

    private final UserRepository userRepository;
    private final UserConsentRepository consentRepository;
    private final CurrentUserService currentUserService;
    private final ConsentService consentService;

    public ComplianceService(UserRepository userRepository, 
                             UserConsentRepository consentRepository,
                             CurrentUserService currentUserService,
                             ConsentService consentService) {
        this.userRepository = userRepository;
        this.consentRepository = consentRepository;
        this.currentUserService = currentUserService;
        this.consentService = consentService;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> exportUserData() {
        User user = currentUserService.getCurrentUserEntity();
        
        Map<String, Object> exportData = new HashMap<>();
        exportData.put("profile", user);
        exportData.put("consents", consentRepository.findByUserIdAndStatus(user.getId(), "ACTIVE"));
        
        // Audit log for export action
        consentService.recordConsent("DATA_EXPORT_REQUESTED", "SYSTEM");
        
        return exportData;
    }

    @Transactional
    public void deleteUserData(String ipAddress) {
        User user = currentUserService.getCurrentUserEntity();
        
        // Audit the deletion first
        consentService.recordConsent("ACCOUNT_DELETION_REQUESTED", ipAddress);
        
        // Physical deletion (or pseudonymization depending on compliance). We do physical here.
        userRepository.delete(user);
    }
}
