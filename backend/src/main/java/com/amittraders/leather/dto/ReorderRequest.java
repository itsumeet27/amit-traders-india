package com.amittraders.leather.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ReorderRequest(
        @NotEmpty @Valid List<ReorderItem> items
) {
    public record ReorderItem(
            @NotNull Long id,
            @NotNull Integer displayOrder
    ) {
    }
}
