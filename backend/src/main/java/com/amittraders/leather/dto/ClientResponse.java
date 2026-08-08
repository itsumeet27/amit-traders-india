package com.amittraders.leather.dto;

import java.time.Instant;

public record ClientResponse(
        Long id,
        String companyName,
        String logoUrl,
        String description,
        int displayOrder,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {
}
