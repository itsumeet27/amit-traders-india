package com.amittraders.leather.controller;

import com.amittraders.leather.dto.MediaUploadResponse;
import com.amittraders.leather.exception.BadRequestException;
import com.amittraders.leather.service.FileStorageService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@RestController
@RequestMapping("/api/admin/upload")
public class AdminUploadController {

    private static final Set<String> ALLOWED_FOLDERS = Set.of("products", "clients", "company", "gallery");

    private final FileStorageService fileStorageService;

    public AdminUploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MediaUploadResponse upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "gallery") String folder) {
        String normalized = folder == null ? "gallery" : folder.trim().toLowerCase();
        if (!ALLOWED_FOLDERS.contains(normalized)) {
            throw new BadRequestException("folder must be one of: products, clients, company, gallery");
        }
        return fileStorageService.store(file, normalized, false);
    }
}
