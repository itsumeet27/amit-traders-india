package com.amittraders.leather.dto;

import java.time.Instant;

public record LookupOptionResponse(
        Long id,
        String name,
        int displayOrder,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {
}
