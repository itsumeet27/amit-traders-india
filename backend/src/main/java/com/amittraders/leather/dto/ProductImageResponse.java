package com.amittraders.leather.dto;

public record ProductImageResponse(
        Long id,
        String imageUrl,
        String altText,
        int displayOrder
) {
}
