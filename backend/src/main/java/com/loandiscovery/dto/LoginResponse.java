package com.loandiscovery.dto;

import java.time.Instant;

public class LoginResponse {

    private final String token;
    private final Instant expiresAt;
    private final AuthUserResponse user;

    public LoginResponse(String token, Instant expiresAt, AuthUserResponse user) {
        this.token = token;
        this.expiresAt = expiresAt;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public AuthUserResponse getUser() {
        return user;
    }
}
