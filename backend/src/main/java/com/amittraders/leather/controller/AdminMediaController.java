package com.amittraders.leather.controller;

import com.amittraders.leather.dto.MediaUploadResponse;
import com.amittraders.leather.service.FileStorageService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/media")
public class AdminMediaController {

    private final FileStorageService fileStorageService;

    public AdminMediaController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @GetMapping
    public List<MediaUploadResponse> list() {
        return fileStorageService.listAll();
    }

    @PostMapping("/upload")
    @ResponseStatus(HttpStatus.CREATED)
    public MediaUploadResponse upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "gallery") String folder) {
        return fileStorageService.store(file, folder, false);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        fileStorageService.delete(id);
    }
}
