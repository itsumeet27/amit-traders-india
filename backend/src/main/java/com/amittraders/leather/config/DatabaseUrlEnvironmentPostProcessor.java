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
import java.util.Locale;
import java.util.Map;

/**
 * Maps Neon / Railway / Heroku-style {@code DATABASE_URL}
 * ({@code postgres://} or {@code postgresql://}) into Spring datasource properties.
 * Ensures remote hosts get {@code sslmode=require} (required by Neon).
 */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String explicitJdbc = firstNonBlank(
                environment.getProperty("DB_URL"),
                environment.getProperty("SPRING_DATASOURCE_URL"));
        if (explicitJdbc != null && explicitJdbc.startsWith("jdbc:")) {
            Map<String, Object> props = new HashMap<>();
            props.put("spring.datasource.url", ensureSsl(explicitJdbc));
            props.put("DB_URL", ensureSsl(explicitJdbc));
            environment.getPropertySources().addFirst(new MapPropertySource("databaseUrlMapping", props));
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
            throw new IllegalStateException(
                    "Failed to parse DATABASE_URL for JDBC. "
                            + "Use the Neon connection string, e.g. "
                            + "postgresql://USER:PASSWORD@ep-xxx.region.aws.neon.tech/neondb?sslmode=require",
                    ex);
        }
    }

    static Map<String, Object> parseDatabaseUrl(String raw) throws Exception {
        String normalized = raw.trim().replace("\"", "");
        if (normalized.startsWith("jdbc:")) {
            Map<String, Object> props = new HashMap<>();
            String jdbc = ensureSsl(normalized);
            props.put("spring.datasource.url", jdbc);
            props.put("DB_URL", jdbc);
            return props;
        }
        if (normalized.startsWith("postgres://")) {
            normalized = "postgresql://" + normalized.substring("postgres://".length());
        }
        if (!normalized.startsWith("postgresql://")) {
            throw new IllegalArgumentException("Unsupported database URL scheme: " + sanitizeForLog(raw));
        }

        // Prefer URI parsing; fall back to manual split for awkward passwords.
        String username;
        String password;
        String host;
        int port;
        String dbName;
        String query;

        try {
            URI uri = URI.create(normalized);
            String userInfo = uri.getUserInfo();
            username = null;
            password = null;
            if (userInfo != null) {
                String[] parts = userInfo.split(":", 2);
                username = urlDecode(parts[0]);
                if (parts.length > 1) {
                    password = urlDecode(parts[1]);
                }
            }
            host = uri.getHost();
            port = uri.getPort() > 0 ? uri.getPort() : 5432;
            String path = uri.getPath() == null ? "" : uri.getPath();
            if (path.startsWith("/")) {
                path = path.substring(1);
            }
            dbName = path.contains("?") ? path.substring(0, path.indexOf('?')) : path;
            query = uri.getQuery();
        } catch (Exception ignored) {
            ParsedUrl parsed = parseManually(normalized);
            username = parsed.username;
            password = parsed.password;
            host = parsed.host;
            port = parsed.port;
            dbName = parsed.dbName;
            query = parsed.query;
        }

        if (host == null || host.isBlank() || dbName == null || dbName.isBlank()) {
            throw new IllegalArgumentException("DATABASE_URL missing host or database name");
        }

        StringBuilder jdbc = new StringBuilder("jdbc:postgresql://")
                .append(host).append(':').append(port).append('/').append(dbName);
        if (query != null && !query.isBlank()) {
            jdbc.append('?').append(query);
        }

        String jdbcUrl = ensureSsl(jdbc.toString());

        Map<String, Object> props = new HashMap<>();
        props.put("spring.datasource.url", jdbcUrl);
        props.put("DB_URL", jdbcUrl);
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

    /** Neon and most cloud Postgres require SSL. */
    static String ensureSsl(String jdbcUrl) {
        String lower = jdbcUrl.toLowerCase(Locale.ROOT);
        if (lower.contains("localhost") || lower.contains("127.0.0.1")) {
            return jdbcUrl;
        }
        if (lower.contains("sslmode=")) {
            return jdbcUrl;
        }
        return jdbcUrl + (jdbcUrl.contains("?") ? "&" : "?") + "sslmode=require";
    }

    private static ParsedUrl parseManually(String postgresqlUrl) {
        String rest = postgresqlUrl.substring("postgresql://".length());
        String query = null;
        int q = rest.indexOf('?');
        if (q >= 0) {
            query = rest.substring(q + 1);
            rest = rest.substring(0, q);
        }
        int at = rest.lastIndexOf('@');
        if (at < 0) {
            throw new IllegalArgumentException("DATABASE_URL must include userinfo@host");
        }
        String userInfo = rest.substring(0, at);
        String hostPart = rest.substring(at + 1);
        String username;
        String password = null;
        int colon = userInfo.indexOf(':');
        if (colon >= 0) {
            username = urlDecode(userInfo.substring(0, colon));
            password = urlDecode(userInfo.substring(colon + 1));
        } else {
            username = urlDecode(userInfo);
        }
        String host;
        int port = 5432;
        String dbName;
        int slash = hostPart.indexOf('/');
        if (slash < 0) {
            throw new IllegalArgumentException("DATABASE_URL must include /dbname");
        }
        String hostPort = hostPart.substring(0, slash);
        dbName = hostPart.substring(slash + 1);
        if (hostPort.startsWith("[") && hostPort.contains("]")) {
            // IPv6 — uncommon on Neon
            host = hostPort;
        } else if (hostPort.contains(":")) {
            int c = hostPort.lastIndexOf(':');
            host = hostPort.substring(0, c);
            port = Integer.parseInt(hostPort.substring(c + 1));
        } else {
            host = hostPort;
        }
        return new ParsedUrl(username, password, host, port, dbName, query);
    }

    private static String urlDecode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }

    private static String sanitizeForLog(String value) {
        if (value == null) {
            return "";
        }
        return value.replaceAll("://([^:/@]+):([^@/]+)@", "://$1:***@");
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

    private record ParsedUrl(
            String username,
            String password,
            String host,
            int port,
            String dbName,
            String query) {
    }
}
