package com.amittraders.leather.controller;

import com.amittraders.leather.dto.BulkDeleteResponse;
import com.amittraders.leather.dto.BulkIdsRequest;
import com.amittraders.leather.dto.EnquiryResponse;
import com.amittraders.leather.dto.EnquiryStatusUpdateRequest;
import com.amittraders.leather.dto.PageResponse;
import com.amittraders.leather.entity.EnquiryStatus;
import com.amittraders.leather.service.EnquiryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/enquiries")
public class AdminEnquiryController {

    private final EnquiryService enquiryService;

    public AdminEnquiryController(EnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    @GetMapping
    public PageResponse<EnquiryResponse> list(
            @RequestParam(required = false) EnquiryStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return enquiryService.search(status, search, page, size);
    }

    @GetMapping("/{id}")
    public EnquiryResponse get(@PathVariable Long id) {
        return enquiryService.getById(id);
    }

    @PatchMapping("/{id}/status")
    public EnquiryResponse updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody EnquiryStatusUpdateRequest request) {
        return enquiryService.updateStatus(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        enquiryService.delete(id);
    }

    @PostMapping("/bulk-delete")
    public BulkDeleteResponse bulkDelete(@Valid @RequestBody BulkIdsRequest request) {
        return enquiryService.deleteBulk(request.ids());
    }
}
