package com.amittraders.leather.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record BulkIdsRequest(
        @NotEmpty List<Long> ids
) {
}
