package com.amittraders.leather.controller;

import com.amittraders.leather.dto.BulkDeleteResponse;
import com.amittraders.leather.security.JwtAuthenticationFilter;
import com.amittraders.leather.service.CategoryService;
import com.amittraders.leather.service.EnquiryService;
import com.amittraders.leather.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(
        controllers = {
                AdminProductController.class,
                AdminCategoryController.class,
                AdminEnquiryController.class
        },
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = JwtAuthenticationFilter.class
        )
)
@AutoConfigureMockMvc(addFilters = false)
class AdminBulkDeleteControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    ProductService productService;

    @MockitoBean
    CategoryService categoryService;

    @MockitoBean
    EnquiryService enquiryService;

    @Test
    @WithMockUser(roles = "ADMIN")
    void productBulkDeleteReturnsSummary() throws Exception {
        when(productService.deleteBulk(anyList()))
                .thenReturn(new BulkDeleteResponse(2, List.of(1L, 2L), List.of()));

        mockMvc.perform(post("/api/admin/products/bulk-delete")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"ids\":[1,2]}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deletedCount").value(2))
                .andExpect(jsonPath("$.deletedIds[0]").value(1));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void categoryBulkDeleteReturnsFailures() throws Exception {
        when(categoryService.deleteBulk(anyList()))
                .thenReturn(new BulkDeleteResponse(
                        1,
                        List.of(10L),
                        List.of(new BulkDeleteResponse.FailedItem(11L, "Cannot delete category with linked products"))));

        mockMvc.perform(post("/api/admin/categories/bulk-delete")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"ids\":[10,11]}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deletedCount").value(1))
                .andExpect(jsonPath("$.failed[0].id").value(11));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void enquiryBulkDeleteReturnsSummary() throws Exception {
        when(enquiryService.deleteBulk(anyList()))
                .thenReturn(new BulkDeleteResponse(3, List.of(7L, 8L, 9L), List.of()));

        mockMvc.perform(post("/api/admin/enquiries/bulk-delete")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"ids\":[7,8,9]}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deletedCount").value(3));
    }
}
