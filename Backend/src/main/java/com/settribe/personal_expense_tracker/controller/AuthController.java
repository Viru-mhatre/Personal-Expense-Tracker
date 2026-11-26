package com.settribe.personal_expense_tracker.controller;

import com.settribe.personal_expense_tracker.dto.AuthResponse;
import com.settribe.personal_expense_tracker.dto.LoginRequest;
import com.settribe.personal_expense_tracker.dto.RegisterRequest;
import com.settribe.personal_expense_tracker.dto.EmailRequest;
import com.settribe.personal_expense_tracker.dto.PasswordRequest;

import com.settribe.personal_expense_tracker.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // REGISTER API
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        AuthResponse response = authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // CHECK EMAIL API
    @PostMapping("/check-email")
    public ResponseEntity<?> checkEmail(
            @RequestBody EmailRequest request) {

        boolean exists = authService.checkEmail(request.getEmail());

        if (exists) {
            return ResponseEntity.ok("Email registered");
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Email not registered");
    }

    // RESET PASSWORD API
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody PasswordRequest request) {

        String response = authService.resetPassword(
                request.getEmail(),
                request.getNewPassword());

        return ResponseEntity.ok(response);
    }

    // LOGIN API
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse response = authService.login(request);

        return ResponseEntity.ok(response);
    }
}
