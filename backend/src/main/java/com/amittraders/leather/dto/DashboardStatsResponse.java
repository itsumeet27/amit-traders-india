package com.amittraders.leather.dto;

public record DashboardStatsResponse(
        long totalProducts,
        long activeProducts,
        long featuredProducts,
        long totalCategories,
        long activeCategories,
        long totalClients,
        long totalEnquiries,
        long newEnquiries,
        long pendingEnquiries,
        long quotedEnquiries,
        long inProgressEnquiries,
        long convertedEnquiries
) {
}
