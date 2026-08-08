package com.amittraders.leather.controller;

import com.amittraders.leather.dto.EnquiryRequest;
import com.amittraders.leather.dto.EnquiryResponse;
import com.amittraders.leather.service.EnquiryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/enquiries")
public class EnquiryController {

    private final EnquiryService enquiryService;

    public EnquiryController(EnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public EnquiryResponse createMultipart(
            @Valid @RequestPart("enquiry") EnquiryRequest request,
            @RequestPart(value = "attachment", required = false) MultipartFile attachment) {
        return enquiryService.create(request, attachment);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public EnquiryResponse createJson(@Valid @RequestBody EnquiryRequest request) {
        return enquiryService.create(request, null);
    }
}
