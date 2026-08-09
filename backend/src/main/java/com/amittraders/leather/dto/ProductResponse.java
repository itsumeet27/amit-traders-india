package com.amittraders.leather.dto;

import java.time.Instant;
import java.util.List;

public record ProductResponse(
        Long id,
        Long categoryId,
        String categoryName,
        String categorySlug,
        String name,
        String slug,
        String shortDescription,
        String description,
        String material,
        String leatherType,
        String colors,
        String dimensions,
        String customization,
        String branding,
        String manufacturingInfo,
        int minimumOrderQuantity,
        boolean featured,
        boolean active,
        List<ProductImageResponse> images,
        Instant createdAt,
        Instant updatedAt
) {
}
