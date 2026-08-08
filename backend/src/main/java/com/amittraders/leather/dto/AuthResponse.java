package com.amittraders.leather.dto;

public record AuthResponse(
        String token,
        String type,
        long expiresIn,
        String name,
        String email
) {
    public static AuthResponse bearer(String token, long expiresIn, String name, String email) {
        return new AuthResponse(token, "Bearer", expiresIn, name, email);
    }
}
