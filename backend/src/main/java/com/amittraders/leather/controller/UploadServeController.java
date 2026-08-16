package com.amittraders.leather.controller;

import com.amittraders.leather.service.FileStorageService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UploadServeController {

    private final FileStorageService fileStorageService;

    public UploadServeController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/uploads/**")
    public ResponseEntity<byte[]> serveUpload(HttpServletRequest request) {
        String path = request.getRequestURI();
        return fileStorageService.loadByPublicUrl(path)
                .map(file -> ResponseEntity.ok()
                        .header(HttpHeaders.CACHE_CONTROL, "public, max-age=31536000, immutable")
                        .contentType(MediaType.parseMediaType(file.contentType()))
                        .body(file.data()))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
