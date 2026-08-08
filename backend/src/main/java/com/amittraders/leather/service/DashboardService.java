package com.amittraders.leather.service;

import com.amittraders.leather.dto.DashboardStatsResponse;
import com.amittraders.leather.entity.EnquiryStatus;
import com.amittraders.leather.repository.ClientRepository;
import com.amittraders.leather.repository.EnquiryRepository;
import com.amittraders.leather.repository.ProductCategoryRepository;
import com.amittraders.leather.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {

    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;
    private final ClientRepository clientRepository;
    private final EnquiryRepository enquiryRepository;

    public DashboardService(
            ProductRepository productRepository,
            ProductCategoryRepository categoryRepository,
            ClientRepository clientRepository,
            EnquiryRepository enquiryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.clientRepository = clientRepository;
        this.enquiryRepository = enquiryRepository;
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getStats() {
        return new DashboardStatsResponse(
                productRepository.count(),
                productRepository.countByActiveTrue(),
                productRepository.countByFeaturedTrueAndActiveTrue(),
                categoryRepository.count(),
                clientRepository.count(),
                enquiryRepository.count(),
                enquiryRepository.countByStatus(EnquiryStatus.NEW),
                enquiryRepository.countByStatus(EnquiryStatus.IN_PROGRESS)
                        + enquiryRepository.countByStatus(EnquiryStatus.CONTACTED)
                        + enquiryRepository.countByStatus(EnquiryStatus.QUOTED),
                enquiryRepository.countByStatus(EnquiryStatus.CONVERTED)
        );
    }
}
