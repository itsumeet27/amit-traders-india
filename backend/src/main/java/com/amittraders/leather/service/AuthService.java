package com.amittraders.leather.service;

import com.amittraders.leather.dto.AuthResponse;
import com.amittraders.leather.dto.LoginRequest;
import com.amittraders.leather.entity.Admin;
import com.amittraders.leather.repository.AdminRepository;
import com.amittraders.leather.security.JwtService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(AdminRepository adminRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Admin admin = adminRepository.findByEmail(request.email().trim().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), admin.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = jwtService.generateToken(admin.getEmail(), admin.getRole(), admin.getName());
        return AuthResponse.bearer(token, jwtService.getExpirationMs(), admin.getName(), admin.getEmail());
    }
}
