package com.loandiscovery.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class IfscResponse {

    @JsonProperty("BANK")
    private String bank;

    @JsonProperty("IFSC")
    private String ifsc;

    @JsonProperty("BRANCH")
    private String branch;

    @JsonProperty("ADDRESS")
    private String address;

    @JsonProperty("CITY")
    private String city;

    @JsonProperty("DISTRICT")
    private String district;

    @JsonProperty("STATE")
    private String state;

    @JsonProperty("CONTACT")
    private String contact;

    @JsonProperty("IMPS")
    private Boolean imps;

    @JsonProperty("RTGS")
    private Boolean rtgs;

    @JsonProperty("UPI")
    private Boolean upi;

    @JsonProperty("NEFT")
    private Boolean neft;

    @JsonProperty("MICR")
    private String micr;

    @JsonProperty("BANKCODE")
    private String bankCode;

    // ─── Getters & Setters ───────────────────────────

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
}
