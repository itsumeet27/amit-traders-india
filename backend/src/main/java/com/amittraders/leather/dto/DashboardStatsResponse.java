package com.amittraders.leather.dto;

public record DashboardStatsResponse(
        long totalProducts,
        long activeProducts,
        long featuredProducts,
        long totalCategories,
        long totalClients,
        long totalEnquiries,
        long newEnquiries,
        long inProgressEnquiries,
        long convertedEnquiries
) {
}
