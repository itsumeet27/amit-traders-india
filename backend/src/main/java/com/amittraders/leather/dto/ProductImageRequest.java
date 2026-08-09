package com.amittraders.leather.dto;

import jakarta.validation.constraints.NotBlank;

public record ProductImageRequest(
        @NotBlank String imageUrl,
        String altText,
        Integer displayOrder
) {
}
