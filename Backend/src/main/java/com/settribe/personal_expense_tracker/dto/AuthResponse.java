package com.settribe.personal_expense_tracker.dto;

public class AuthResponse {

    private String token;
    private String tokenType;
    private String email;
    private String name;

    public AuthResponse() {
    }

    public AuthResponse(String token, String tokenType,
                        String email, String name) {
        this.token = token;
        this.tokenType = tokenType;
        this.email = email;
        this.name = name;
    }

    public String getToken() {
        return token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }
}
