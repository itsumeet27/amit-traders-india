package com.amittraders.leather.dto;

import jakarta.validation.constraints.NotNull;

public record ProductFeaturedRequest(
        @NotNull Boolean featured
) {
}
