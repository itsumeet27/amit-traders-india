package com.amittraders.leather.dto;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public record ApiError(
        String message,
        Map<String, String> errors,
        int status,
        Instant timestamp
) {
    public static ApiError of(String message, int status) {
        return new ApiError(message, null, status, Instant.now());
    }

    public static ApiError of(String message, Map<String, String> errors, int status) {
        return new ApiError(message, errors, status, Instant.now());
    }

    public static ApiError of(String message, List<String> errorList, int status) {
        Map<String, String> map = null;
        if (errorList != null && !errorList.isEmpty()) {
            map = java.util.stream.IntStream.range(0, errorList.size())
                    .boxed()
                    .collect(java.util.stream.Collectors.toMap(
                            i -> "error" + (i + 1),
                            errorList::get,
                            (a, b) -> a,
                            java.util.LinkedHashMap::new));
        }
        return new ApiError(message, map, status, Instant.now());
    }
}
