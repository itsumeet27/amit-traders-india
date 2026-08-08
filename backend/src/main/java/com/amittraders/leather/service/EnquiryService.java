package com.amittraders.leather.service;

import com.amittraders.leather.dto.EnquiryRequest;
import com.amittraders.leather.dto.EnquiryResponse;
import com.amittraders.leather.dto.EnquiryStatusUpdateRequest;
import com.amittraders.leather.dto.MediaUploadResponse;
import com.amittraders.leather.dto.PageResponse;
import com.amittraders.leather.entity.Enquiry;
import com.amittraders.leather.entity.EnquiryStatus;
import com.amittraders.leather.exception.BadRequestException;
import com.amittraders.leather.exception.ResourceNotFoundException;
import com.amittraders.leather.mapper.EntityMapper;
import com.amittraders.leather.repository.EnquiryRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class EnquiryService {

    private final EnquiryRepository enquiryRepository;
    private final FileStorageService fileStorageService;
    private final int minQuantity;

    public EnquiryService(
            EnquiryRepository enquiryRepository,
            FileStorageService fileStorageService,
            @Value("${app.enquiry.min-quantity:50}") int minQuantity) {
        this.enquiryRepository = enquiryRepository;
        this.fileStorageService = fileStorageService;
        this.minQuantity = minQuantity;
    }

    @Transactional
    public EnquiryResponse create(EnquiryRequest request, MultipartFile attachment) {
        if (request.quantity() == null || request.quantity() < minQuantity) {
            throw new BadRequestException("Quantity must be at least " + minQuantity + " (MOQ)");
        }

        String productType = request.productType().trim().toUpperCase();
        if (!productType.equals("EXISTING") && !productType.equals("CUSTOM")) {
            throw new BadRequestException("productType must be EXISTING or CUSTOM");
        }

        String attachmentUrl = null;
        if (attachment != null && !attachment.isEmpty()) {
            MediaUploadResponse uploaded = fileStorageService.store(attachment, "enquiries", true);
            attachmentUrl = uploaded.url();
        }

        Enquiry enquiry = Enquiry.builder()
                .fullName(request.fullName().trim())
                .companyName(request.companyName())
                .email(request.email().trim().toLowerCase())
                .phone(request.phone())
                .country(request.country())
                .city(request.city())
                .website(request.website())
                .productType(productType)
                .productCategory(request.productCategory())
                .productName(request.productName())
                .quantity(request.quantity())
                .leatherType(request.leatherType())
                .preferredColor(request.preferredColor())
                .customizationRequirements(request.customizationRequirements())
                .brandingRequirements(request.brandingRequirements())
                .additionalRequirements(request.additionalRequirements())
                .message(request.message())
                .attachmentUrl(attachmentUrl)
                .status(EnquiryStatus.NEW)
                .build();

        return EntityMapper.toEnquiryResponse(enquiryRepository.save(enquiry));
    }

    @Transactional(readOnly = true)
    public PageResponse<EnquiryResponse> search(EnquiryStatus status, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<EnquiryResponse> result = enquiryRepository
                .search(status, blankToNull(search), pageable)
                .map(EntityMapper::toEnquiryResponse);
        return PageResponse.from(result);
    }

    @Transactional(readOnly = true)
    public EnquiryResponse getById(Long id) {
        return EntityMapper.toEnquiryResponse(findById(id));
    }

    @Transactional
    public EnquiryResponse updateStatus(Long id, EnquiryStatusUpdateRequest request) {
        Enquiry enquiry = findById(id);
        enquiry.setStatus(request.status());
        return EntityMapper.toEnquiryResponse(enquiryRepository.save(enquiry));
    }

    @Transactional
    public void delete(Long id) {
        enquiryRepository.delete(findById(id));
    }

    private Enquiry findById(Long id) {
        return enquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry not found: " + id));
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
