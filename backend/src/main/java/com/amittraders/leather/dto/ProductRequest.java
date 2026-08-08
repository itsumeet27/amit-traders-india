package com.amittraders.leather.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ProductRequest(
        @NotNull Long categoryId,
        @NotBlank String name,
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
        @Min(50) Integer minimumOrderQuantity,
        Boolean featured,
        Boolean active,
        List<ProductImageRequest> images
) {
}
