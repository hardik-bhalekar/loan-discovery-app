package com.loandiscovery.service;

import com.loandiscovery.entity.OtpRecord;
import com.loandiscovery.model.User;
import com.loandiscovery.repository.OtpRecordRepository;
import com.loandiscovery.repository.UserRepository;
import com.loandiscovery.security.CurrentUserService;
import java.time.LocalDateTime;
import java.util.Random;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class KycService {
    private static final Logger log = LoggerFactory.getLogger(KycService.class);

    private final OtpRecordRepository otpRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;
    private final PasswordEncoder passwordEncoder;

    public KycService(OtpRecordRepository otpRepository, UserRepository userRepository, 
                      CurrentUserService currentUserService, PasswordEncoder passwordEncoder) {
        this.otpRepository = otpRepository;
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void sendOtp(String phone) {
        // Rate limiting logic could be added here
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        OtpRecord record = new OtpRecord();
        record.setIdentifier(phone);
        // Hash OTP for security
        record.setOtpHash(passwordEncoder.encode(otp));
        record.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        record.setVerified(false);
        record.setAttempts(0);
        
        otpRepository.save(record);
        
        // Mock sending SMS
        String maskedOtp = otp.replaceAll(".(?=.{2})", "*");
        log.info("MOCK SMS: OTP for {} is {}", phone, maskedOtp);
    }

    @Transactional
    public void verifyOtp(String phone, String otp) {
        OtpRecord record = otpRepository.findTopByIdentifierOrderByExpiresAtDesc(phone)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No OTP found"));

        if (record.isVerified()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP already used");
        }
        if (record.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP expired");
        }
        if (record.getAttempts() >= 3) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many failed attempts");
        }

        record.setAttempts(record.getAttempts() + 1);

        if (!passwordEncoder.matches(otp, record.getOtpHash())) {
            otpRepository.save(record);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid OTP");
        }

        record.setVerified(true);
        otpRepository.save(record);
    }

    @Transactional
    public void submitPan(String panNumber) {
        User user = currentUserService.getCurrentUserEntity();
        
        // Mock PAN verification with 3rd party provider
        log.info("Verifying PAN status for user {}", user.getId());
        
        // Assume valid for stub
        boolean isValid = panNumber.matches("[A-Z]{5}[0-9]{4}[A-Z]{1}");
        if (!isValid) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid PAN format");
        }

        user.setPanNumber(panNumber);
        user.setKycVerified(true);
        userRepository.save(user);
    }
}
