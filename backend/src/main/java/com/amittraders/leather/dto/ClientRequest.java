package com.amittraders.leather.dto;

import jakarta.validation.constraints.NotBlank;

public record ClientRequest(
        @NotBlank String companyName,
        String logoUrl,
        String description,
        Integer displayOrder,
        Boolean active
) {
}
