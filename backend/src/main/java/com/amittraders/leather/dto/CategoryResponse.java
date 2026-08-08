package com.amittraders.leather.dto;

import java.time.Instant;

public record CategoryResponse(
        Long id,
        String name,
        String slug,
        String description,
        String imageUrl,
        int displayOrder,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {
}
