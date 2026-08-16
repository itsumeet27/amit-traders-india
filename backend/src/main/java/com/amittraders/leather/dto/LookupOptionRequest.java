package com.amittraders.leather.dto;

import jakarta.validation.constraints.NotBlank;

public record LookupOptionRequest(
        @NotBlank String name,
        Integer displayOrder,
        Boolean active
) {
}
