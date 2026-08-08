package com.amittraders.leather.dto;

import java.time.Instant;

public record MediaUploadResponse(
        Long id,
        String filename,
        String originalFilename,
        String url,
        String contentType,
        Long sizeBytes,
        String folder,
        Instant createdAt
) {
}
