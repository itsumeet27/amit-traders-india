package com.amittraders.leather.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final String[] allowedOrigins;
    private final String fileStoragePath;
    private final String urlPrefix;

    public WebConfig(
            @Value("${app.cors.allowed-origins}") String allowedOrigins,
            @Value("${app.file-storage.path}") String fileStoragePath,
            @Value("${app.file-storage.url-prefix}") String urlPrefix) {
        this.allowedOrigins = allowedOrigins.split(",");
        this.fileStoragePath = fileStoragePath;
        this.urlPrefix = urlPrefix.endsWith("/") ? urlPrefix.substring(0, urlPrefix.length() - 1) : urlPrefix;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(trimAll(allowedOrigins))
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadPath = Paths.get(fileStoragePath).toAbsolutePath().normalize();
        String location = uploadPath.toUri().toString();
        if (!location.endsWith("/")) {
            location = location + "/";
        }
        registry.addResourceHandler(urlPrefix + "/**")
                .addResourceLocations(location);
    }

    private static String[] trimAll(String[] values) {
        String[] trimmed = new String[values.length];
        for (int i = 0; i < values.length; i++) {
            trimmed[i] = values[i].trim();
        }
        return trimmed;
    }
}
