package com.amittraders.leather.dto;

import java.util.List;

public record BulkDeleteResponse(
        int deletedCount,
        List<Long> deletedIds,
        List<FailedItem> failed
) {
    public record FailedItem(Long id, String reason) {
    }
}
