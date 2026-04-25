package com.loandiscovery.service;

import com.loandiscovery.entity.UserConsent;
import com.loandiscovery.model.User;
import com.loandiscovery.repository.UserConsentRepository;
import com.loandiscovery.security.CurrentUserService;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ConsentService {

    private final UserConsentRepository consentRepository;
    private final CurrentUserService currentUserService;

    public ConsentService(UserConsentRepository consentRepository, CurrentUserService currentUserService) {
        this.consentRepository = consentRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public UserConsent recordConsent(String consentType, String ipAddress) {
        User user = currentUserService.getCurrentUserEntity();
        
        UserConsent consent = new UserConsent();
        consent.setUserId(user.getId());
        consent.setConsentType(consentType);
        consent.setIpAddress(ipAddress);
        consent.setGivenAt(LocalDateTime.now());
        consent.setStatus("ACTIVE");
        
        return consentRepository.save(consent);
    }

    @Transactional(readOnly = true)
    public List<UserConsent> getActiveConsents() {
        User user = currentUserService.getCurrentUserEntity();
        return consentRepository.findByUserIdAndStatus(user.getId(), "ACTIVE");
    }
}
