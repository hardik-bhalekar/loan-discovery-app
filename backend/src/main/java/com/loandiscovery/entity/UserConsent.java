package com.loandiscovery.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_consents", indexes = {
    @Index(name = "idx_user_consents_user_id", columnList = "user_id")
})
public class UserConsent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "consent_type", nullable = false, length = 50)
    private String consentType;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "given_at", nullable = false)
    private LocalDateTime givenAt;

    @Column(length = 20)
    private String status;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getConsentType() { return consentType; }
    public void setConsentType(String consentType) { this.consentType = consentType; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public LocalDateTime getGivenAt() { return givenAt; }
    public void setGivenAt(LocalDateTime givenAt) { this.givenAt = givenAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
