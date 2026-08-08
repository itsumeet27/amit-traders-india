package com.amittraders.leather.dto;

import com.amittraders.leather.entity.EnquiryStatus;

import java.time.Instant;

public record EnquiryResponse(
        Long id,
        String fullName,
        String companyName,
        String email,
        String phone,
        String country,
        String city,
        String website,
        String productType,
        String productCategory,
        String productName,
        int quantity,
        String leatherType,
        String preferredColor,
        String customizationRequirements,
        String brandingRequirements,
        String additionalRequirements,
        String message,
        String attachmentUrl,
        EnquiryStatus status,
        Instant createdAt,
        Instant updatedAt
) {
}
