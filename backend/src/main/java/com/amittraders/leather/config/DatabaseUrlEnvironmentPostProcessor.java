package com.amittraders.leather.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * Maps Railway / Heroku-style {@code DATABASE_URL} (postgres:// or postgresql://)
 * into Spring datasource properties when {@code DB_URL} is not explicitly set.
 */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String explicitJdbc = firstNonBlank(
                environment.getProperty("DB_URL"),
                environment.getProperty("SPRING_DATASOURCE_URL"));
        if (explicitJdbc != null && explicitJdbc.startsWith("jdbc:")) {
            return;
        }

        String databaseUrl = firstNonBlank(
                environment.getProperty("DATABASE_URL"),
                environment.getProperty("POSTGRES_URL"),
                explicitJdbc);
        if (databaseUrl == null || databaseUrl.isBlank()) {
            return;
        }

        try {
            Map<String, Object> props = parseDatabaseUrl(databaseUrl);
            environment.getPropertySources()
                    .addFirst(new MapPropertySource("databaseUrlMapping", props));
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to parse DATABASE_URL for JDBC datasource", ex);
        }
    }

    static Map<String, Object> parseDatabaseUrl(String raw) throws Exception {
        String normalized = raw.trim();
        if (normalized.startsWith("jdbc:")) {
            Map<String, Object> props = new HashMap<>();
            props.put("spring.datasource.url", normalized);
            props.put("DB_URL", normalized);
            return props;
        }
        if (normalized.startsWith("postgres://")) {
            normalized = "postgresql://" + normalized.substring("postgres://".length());
        }
        if (!normalized.startsWith("postgresql://")) {
            throw new IllegalArgumentException("Unsupported database URL scheme: " + raw);
        }

        URI uri = URI.create(normalized);
        String userInfo = uri.getUserInfo();
        String username = null;
        String password = null;
        if (userInfo != null) {
            String[] parts = userInfo.split(":", 2);
            username = urlDecode(parts[0]);
            if (parts.length > 1) {
                password = urlDecode(parts[1]);
            }
        }

        String path = uri.getPath() == null ? "" : uri.getPath();
        if (path.startsWith("/")) {
            path = path.substring(1);
        }
        // Railway sometimes appends query params; keep db name only
        String dbName = path.contains("?") ? path.substring(0, path.indexOf('?')) : path;
        int port = uri.getPort() > 0 ? uri.getPort() : 5432;
        String jdbc = "jdbc:postgresql://" + uri.getHost() + ":" + port + "/" + dbName;
        if (uri.getQuery() != null && !uri.getQuery().isBlank()) {
            jdbc = jdbc + "?" + uri.getQuery();
        }

        Map<String, Object> props = new HashMap<>();
        props.put("spring.datasource.url", jdbc);
        props.put("DB_URL", jdbc);
        if (username != null) {
            props.put("spring.datasource.username", username);
            props.put("DB_USERNAME", username);
        }
        if (password != null) {
            props.put("spring.datasource.password", password);
            props.put("DB_PASSWORD", password);
        }
        return props;
    }

    private static String urlDecode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }

    private static String firstNonBlank(String... values) {
        if (values == null) {
            return null;
        }
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return null;
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 10;
    }
}
