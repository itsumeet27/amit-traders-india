package com.amittraders.leather.dto;

import com.amittraders.leather.entity.EnquiryStatus;
import jakarta.validation.constraints.NotNull;

public record EnquiryStatusUpdateRequest(
        @NotNull EnquiryStatus status
) {
}
