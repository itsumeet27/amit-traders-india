package com.amittraders.leather.dto;

import java.time.Instant;

public record CompanyProfileResponse(
        Long id,
        String companyName,
        String tagline,
        String description,
        String history,
        String mission,
        String vision,
        String phone,
        String email,
        String address,
        String city,
        String state,
        String country,
        String website,
        String linkedin,
        String instagram,
        String heroTitle,
        String heroSubtitle,
        String heroImageUrl,
        String heroCtaPrimary,
        String heroCtaSecondary,
        String aboutImageUrl,
        String whyChooseUsJson,
        String manufacturingStepsJson,
        String customManufacturingTitle,
        String customManufacturingDescription,
        String customManufacturingFeaturesJson,
        String ctaTitle,
        String ctaSubtitle,
        Instant updatedAt
) {
}
