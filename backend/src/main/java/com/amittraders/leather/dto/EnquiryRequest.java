package com.amittraders.leather.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record EnquiryRequest(
        @NotBlank String fullName,
        String companyName,
        @NotBlank @Email String email,
        String phone,
        String country,
        String city,
        String website,
        @NotBlank String productType,
        String productCategory,
        String productName,
        @NotNull @Min(50) Integer quantity,
        String leatherType,
        String preferredColor,
        String customizationRequirements,
        String brandingRequirements,
        String additionalRequirements,
        String message
) {
}
