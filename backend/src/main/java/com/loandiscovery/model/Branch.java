package com.loandiscovery.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "branches", indexes = {
    @Index(name = "idx_ifsc", columnList = "ifsc", unique = true),
    @Index(name = "idx_bank", columnList = "bank"),
    @Index(name = "idx_city", columnList = "city"),
    @Index(name = "idx_bank_code", columnList = "bankCode")
})
public class Branch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String bank;

    @Column(nullable = false, unique = true, length = 11)
    private String ifsc;

    private String branch;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String city;
    private String district;
    private String state;
    private String contact;

    private Boolean imps;
    private Boolean rtgs;
    private Boolean upi;
    private Boolean neft;

    private String micr;
    private String bankCode;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Branch() {}

    // ─── Getters & Setters ───────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBank() { return bank; }
    public void setBank(String bank) { this.bank = bank; }

    public String getIfsc() { return ifsc; }
    public void setIfsc(String ifsc) { this.ifsc = ifsc; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public Boolean getImps() { return imps; }
    public void setImps(Boolean imps) { this.imps = imps; }

    public Boolean getRtgs() { return rtgs; }
    public void setRtgs(Boolean rtgs) { this.rtgs = rtgs; }

    public Boolean getUpi() { return upi; }
    public void setUpi(Boolean upi) { this.upi = upi; }

    public Boolean getNeft() { return neft; }
    public void setNeft(Boolean neft) { this.neft = neft; }

    public String getMicr() { return micr; }
    public void setMicr(String micr) { this.micr = micr; }

    public String getBankCode() { return bankCode; }
    public void setBankCode(String bankCode) { this.bankCode = bankCode; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
