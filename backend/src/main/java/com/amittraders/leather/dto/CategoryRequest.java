package com.amittraders.leather.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequest(
        @NotBlank String name,
        String slug,
        String description,
        String imageUrl,
        Integer displayOrder,
        Boolean active
) {
}
