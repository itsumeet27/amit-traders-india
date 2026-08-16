package com.amittraders.leather.mapper;

import com.amittraders.leather.dto.*;
import com.amittraders.leather.entity.*;

import java.util.Comparator;
import java.util.List;

public final class EntityMapper {

    private EntityMapper() {
    }

    public static CategoryResponse toCategoryResponse(ProductCategory category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                category.getImageUrl(),
                category.getDisplayOrder(),
                category.isActive(),
                category.getCreatedAt(),
                category.getUpdatedAt()
        );
    }

    public static ProductImageResponse toProductImageResponse(ProductImage image) {
        return new ProductImageResponse(
                image.getId(),
                image.getImageUrl(),
                image.getAltText(),
                image.getDisplayOrder()
        );
    }

    public static ProductResponse toProductResponse(Product product) {
        List<ProductImageResponse> images = product.getImages() == null
                ? List.of()
                : product.getImages().stream()
                .sorted(Comparator.comparingInt(ProductImage::getDisplayOrder))
                .map(EntityMapper::toProductImageResponse)
                .toList();

        ProductCategory category = product.getCategory();
        return new ProductResponse(
                product.getId(),
                category != null ? category.getId() : null,
                category != null ? category.getName() : null,
                category != null ? category.getSlug() : null,
                product.getName(),
                product.getSlug(),
                product.getShortDescription(),
                product.getDescription(),
                product.getMaterial(),
                product.getLeatherType(),
                product.getColors(),
                product.getDimensions(),
                product.getCustomization(),
                product.getBranding(),
                product.getManufacturingInfo(),
                product.getMinimumOrderQuantity(),
                product.isFeatured(),
                product.isActive(),
                images,
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }

    public static ClientResponse toClientResponse(Client client) {
        return new ClientResponse(
                client.getId(),
                client.getCompanyName(),
                client.getLogoUrl(),
                client.getDescription(),
                client.getDisplayOrder(),
                client.isActive(),
                client.getCreatedAt(),
                client.getUpdatedAt()
        );
    }

    public static CompanyProfileResponse toCompanyProfileResponse(CompanyProfile profile) {
        return new CompanyProfileResponse(
                profile.getId(),
                profile.getCompanyName(),
                profile.getTagline(),
                profile.getDescription(),
                profile.getHistory(),
                profile.getStoryHeadline(),
                profile.getMissionHeadline(),
                profile.getMission(),
                profile.getMissionCommitmentsJson(),
                profile.getMissionClosing(),
                profile.getVisionHeadline(),
                profile.getVision(),
                profile.getAboutHeroTitle(),
                profile.getAboutHeroSubtitle(),
                profile.getAboutValuesJson(),
                profile.getAboutPromiseHeadline(),
                profile.getAboutPromiseBody(),
                profile.getAboutPromiseClosing(),
                profile.getPhone(),
                profile.getEmail(),
                profile.getAddress(),
                profile.getCity(),
                profile.getState(),
                profile.getCountry(),
                profile.getWebsite(),
                profile.getLinkedin(),
                profile.getInstagram(),
                profile.getHeroTitle(),
                profile.getHeroSubtitle(),
                profile.getHeroImageUrl(),
                profile.getHeroCtaPrimary(),
                profile.getHeroCtaSecondary(),
                profile.getAboutImageUrl(),
                profile.getWhyChooseUsJson(),
                profile.getManufacturingStepsJson(),
                profile.getCustomManufacturingTitle(),
                profile.getCustomManufacturingDescription(),
                profile.getCustomManufacturingFeaturesJson(),
                profile.getCtaTitle(),
                profile.getCtaSubtitle(),
                profile.getUpdatedAt()
        );
    }

    public static EnquiryResponse toEnquiryResponse(Enquiry enquiry) {
        return new EnquiryResponse(
                enquiry.getId(),
                enquiry.getFullName(),
                enquiry.getCompanyName(),
                enquiry.getEmail(),
                enquiry.getPhone(),
                enquiry.getCountry(),
                enquiry.getCity(),
                enquiry.getWebsite(),
                enquiry.getProductType(),
                enquiry.getProductCategory(),
                enquiry.getProductName(),
                enquiry.getQuantity(),
                enquiry.getLeatherType(),
                enquiry.getPreferredColor(),
                enquiry.getCustomizationRequirements(),
                enquiry.getBrandingRequirements(),
                enquiry.getAdditionalRequirements(),
                enquiry.getMessage(),
                enquiry.getAttachmentUrl(),
                enquiry.getStatus(),
                enquiry.getCreatedAt(),
                enquiry.getUpdatedAt()
        );
    }

    public static MediaUploadResponse toMediaUploadResponse(MediaAsset asset) {
        return new MediaUploadResponse(
                asset.getId(),
                asset.getFilename(),
                asset.getOriginalFilename(),
                asset.getUrl(),
                asset.getContentType(),
                asset.getSizeBytes(),
                asset.getFolder(),
                asset.getCreatedAt()
        );
    }

    public static LookupOptionResponse toLookupOptionResponse(LeatherType leatherType) {
        return new LookupOptionResponse(
                leatherType.getId(),
                leatherType.getName(),
                leatherType.getDisplayOrder(),
                leatherType.isActive(),
                leatherType.getCreatedAt(),
                leatherType.getUpdatedAt()
        );
    }

    public static LookupOptionResponse toLookupOptionResponse(Material material) {
        return new LookupOptionResponse(
                material.getId(),
                material.getName(),
                material.getDisplayOrder(),
                material.isActive(),
                material.getCreatedAt(),
                material.getUpdatedAt()
        );
    }
}
