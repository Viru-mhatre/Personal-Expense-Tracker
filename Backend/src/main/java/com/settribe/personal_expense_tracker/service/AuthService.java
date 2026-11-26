package com.settribe.personal_expense_tracker.service;

import com.settribe.personal_expense_tracker.dto.AuthResponse;
import com.settribe.personal_expense_tracker.dto.LoginRequest;
import com.settribe.personal_expense_tracker.dto.RegisterRequest;

import com.settribe.personal_expense_tracker.entity.User;

import com.settribe.personal_expense_tracker.repository.UserRepository;

import com.settribe.personal_expense_tracker.security.JWTService;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JWTService jwtService ) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // USER REGISTRATION
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already registered"
            );
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // Encrypt password before saving
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(
                savedUser.getEmail()
        );

        return new AuthResponse(
                token,
                "Bearer",
                savedUser.getEmail(),
                savedUser.getName()
        );
    }


    // CHECK REGISTERED EMAIL
    public boolean checkEmail(String email) {

        return userRepository.existsByEmail(email);
    }

    // RESET PASSWORD
    public String resetPassword(String email, String newPassword) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Email not registered"));

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);

        return "Password reset successfully";
    }


    // USER LOGIN
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid email or password"
                ));

        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!passwordMatches) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                "Bearer",
                user.getEmail(),
                user.getName()
        );
    }
}
