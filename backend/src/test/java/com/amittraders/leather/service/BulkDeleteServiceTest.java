package com.amittraders.leather.service;

import com.amittraders.leather.dto.BulkDeleteResponse;
import com.amittraders.leather.repository.EnquiryRepository;
import com.amittraders.leather.repository.ProductCategoryRepository;
import com.amittraders.leather.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BulkDeleteServiceTest {

    @Mock
    ProductRepository productRepository;

    @Mock
    ProductCategoryRepository categoryRepository;

    @Mock
    EnquiryRepository enquiryRepository;

    @Mock
    FileStorageService fileStorageService;

    @Test
    void productBulkDeleteRemovesExistingIds() {
        ProductService productService = new ProductService(productRepository, categoryRepository, 50);

        when(productRepository.existsById(1L)).thenReturn(true);
        when(productRepository.existsById(2L)).thenReturn(false);
        when(productRepository.existsById(3L)).thenReturn(true);

        BulkDeleteResponse result = productService.deleteBulk(List.of(1L, 2L, 3L));

        assertThat(result.deletedCount()).isEqualTo(2);
        assertThat(result.deletedIds()).containsExactly(1L, 3L);
        assertThat(result.failed()).hasSize(1);
        assertThat(result.failed().getFirst().id()).isEqualTo(2L);
        verify(productRepository).deleteById(1L);
        verify(productRepository).deleteById(3L);
        verify(productRepository, never()).deleteById(2L);
    }

    @Test
    void categoryBulkDeleteSkipsLinkedProducts() {
        CategoryService categoryService = new CategoryService(categoryRepository, productRepository);
        when(categoryRepository.existsById(10L)).thenReturn(true);
        when(categoryRepository.existsById(11L)).thenReturn(true);
        when(productRepository.existsByCategoryId(10L)).thenReturn(false);
        when(productRepository.existsByCategoryId(11L)).thenReturn(true);

        BulkDeleteResponse result = categoryService.deleteBulk(List.of(10L, 11L));

        assertThat(result.deletedCount()).isEqualTo(1);
        assertThat(result.deletedIds()).containsExactly(10L);
        assertThat(result.failed()).hasSize(1);
        assertThat(result.failed().getFirst().id()).isEqualTo(11L);
        assertThat(result.failed().getFirst().reason()).contains("linked products");
        verify(categoryRepository).deleteById(10L);
        verify(categoryRepository, never()).deleteById(11L);
    }

    @Test
    void enquiryBulkDeleteRemovesExistingIds() {
        EnquiryService enquiryService = new EnquiryService(enquiryRepository, fileStorageService, 50);

        when(enquiryRepository.existsById(5L)).thenReturn(true);
        when(enquiryRepository.existsById(6L)).thenReturn(true);

        BulkDeleteResponse result = enquiryService.deleteBulk(List.of(5L, 6L));

        assertThat(result.deletedCount()).isEqualTo(2);
        assertThat(result.deletedIds()).containsExactly(5L, 6L);
        assertThat(result.failed()).isEmpty();
        verify(enquiryRepository).deleteById(5L);
        verify(enquiryRepository).deleteById(6L);
    }
}
