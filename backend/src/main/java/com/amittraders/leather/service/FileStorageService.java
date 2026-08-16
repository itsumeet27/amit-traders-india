package com.amittraders.leather.service;

import com.amittraders.leather.dto.MediaUploadResponse;
import com.amittraders.leather.entity.MediaAsset;
import com.amittraders.leather.exception.BadRequestException;
import com.amittraders.leather.exception.ResourceNotFoundException;
import com.amittraders.leather.mapper.EntityMapper;
import com.amittraders.leather.repository.MediaAssetRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final long MAX_BYTES = 10L * 1024 * 1024;
    private static final Set<String> IMAGE_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif"
    );
    private static final Set<String> ENQUIRY_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"
    );

    private final Path rootPath;
    private final String urlPrefix;
    private final MediaAssetRepository mediaAssetRepository;

    public FileStorageService(
            @Value("${app.file-storage.path}") String storagePath,
            @Value("${app.file-storage.url-prefix}") String urlPrefix,
            MediaAssetRepository mediaAssetRepository) throws IOException {
        this.rootPath = Paths.get(storagePath).toAbsolutePath().normalize();
        this.urlPrefix = urlPrefix.endsWith("/") ? urlPrefix.substring(0, urlPrefix.length() - 1) : urlPrefix;
        this.mediaAssetRepository = mediaAssetRepository;
        Files.createDirectories(this.rootPath);
    }

    @Transactional
    public MediaUploadResponse store(MultipartFile file, String folder, boolean allowPdf) {
        validateFile(file, allowPdf);

        String safeFolder = sanitizeFolder(folder);
        String extension = resolveExtension(file);
        String filename = UUID.randomUUID() + extension;

        try {
            byte[] bytes = file.getBytes();
            Path folderPath = rootPath.resolve(safeFolder);
            Files.createDirectories(folderPath);
            Path target = folderPath.resolve(filename);
            Files.write(target, bytes);

            String url = urlPrefix + "/" + safeFolder + "/" + filename;
            MediaAsset asset = MediaAsset.builder()
                    .filename(filename)
                    .originalFilename(file.getOriginalFilename())
                    .url(url)
                    .contentType(file.getContentType())
                    .sizeBytes(file.getSize())
                    .folder(safeFolder)
                    .fileData(bytes)
                    .build();

            return EntityMapper.toMediaUploadResponse(mediaAssetRepository.save(asset));
        } catch (IOException e) {
            throw new BadRequestException("Failed to store file: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public Optional<StoredFile> loadByPublicUrl(String publicUrl) {
        if (publicUrl == null || publicUrl.isBlank() || !publicUrl.startsWith(urlPrefix + "/")) {
            return Optional.empty();
        }

        Optional<MediaAsset> asset = mediaAssetRepository.findByUrl(publicUrl);
        if (asset.isPresent()) {
            MediaAsset media = asset.get();
            if (media.getFileData() != null && media.getFileData().length > 0) {
                return Optional.of(new StoredFile(
                        media.getFileData(),
                        media.getContentType() != null ? media.getContentType() : MediaType.APPLICATION_OCTET_STREAM_VALUE));
            }
        }

        try {
            String relative = publicUrl.substring(urlPrefix.length() + 1);
            Path filePath = rootPath.resolve(relative).normalize();
            if (!filePath.startsWith(rootPath) || !Files.exists(filePath)) {
                return Optional.empty();
            }
            String contentType = Files.probeContentType(filePath);
            return Optional.of(new StoredFile(
                    Files.readAllBytes(filePath),
                    contentType != null ? contentType : MediaType.APPLICATION_OCTET_STREAM_VALUE));
        } catch (IOException e) {
            return Optional.empty();
        }
    }

    public record StoredFile(byte[] data, String contentType) {
    }

    @Transactional(readOnly = true)
    public List<MediaUploadResponse> listAll() {
        return mediaAssetRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(EntityMapper::toMediaUploadResponse)
                .toList();
    }

    @Transactional
    public void delete(Long id) {
        MediaAsset asset = mediaAssetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Media asset not found: " + id));
        try {
            Path filePath = rootPath.resolve(asset.getFolder()).resolve(asset.getFilename());
            Files.deleteIfExists(filePath);
        } catch (IOException ignored) {
            // continue deleting DB record even if file missing
        }
        mediaAssetRepository.delete(asset);
    }

    private void validateFile(MultipartFile file, boolean allowPdf) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is required");
        }
        if (file.getSize() > MAX_BYTES) {
            throw new BadRequestException("File size exceeds the maximum allowed limit of 10MB");
        }
        String contentType = file.getContentType();
        if (contentType == null) {
            throw new BadRequestException("Unable to determine file content type");
        }
        String normalized = contentType.toLowerCase(Locale.ENGLISH);
        Set<String> allowed = allowPdf ? ENQUIRY_TYPES : IMAGE_TYPES;
        if (!allowed.contains(normalized)) {
            throw new BadRequestException("Unsupported file type: " + contentType
                    + ". Allowed: jpeg, png, webp, gif" + (allowPdf ? ", pdf" : ""));
        }
    }

    private String sanitizeFolder(String folder) {
        if (folder == null || folder.isBlank()) {
            return "gallery";
        }
        String cleaned = folder.trim().toLowerCase(Locale.ENGLISH).replaceAll("[^a-z0-9_-]", "");
        return cleaned.isBlank() ? "gallery" : cleaned;
    }

    private String resolveExtension(MultipartFile file) {
        String original = file.getOriginalFilename();
        if (original != null && original.contains(".")) {
            String ext = original.substring(original.lastIndexOf('.')).toLowerCase(Locale.ENGLISH);
            if (ext.matches("\\.(jpe?g|png|webp|gif|pdf)")) {
                return ext.equals(".jpeg") ? ".jpg" : ext;
            }
        }
        String contentType = file.getContentType() != null ? file.getContentType().toLowerCase(Locale.ENGLISH) : "";
        return switch (contentType) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            case "application/pdf" -> ".pdf";
            default -> "";
        };
    }
}
