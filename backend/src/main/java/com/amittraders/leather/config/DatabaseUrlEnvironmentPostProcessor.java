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
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Maps Neon / Railway / Heroku-style {@code DATABASE_URL} into Spring datasource properties.
 * Neon requires SSL; JDBC expects {@code channelBinding} (camelCase), not {@code channel_binding}.
 */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        boolean onRender = firstNonBlank(
                environment.getProperty("RENDER"),
                environment.getProperty("RENDER_SERVICE_ID"),
                environment.getProperty("RENDER_EXTERNAL_URL")) != null;

        String explicitJdbc = firstNonBlank(
                environment.getProperty("DB_URL"),
                environment.getProperty("SPRING_DATASOURCE_URL"));
        if (explicitJdbc != null && explicitJdbc.startsWith("jdbc:")) {
            Map<String, Object> props = fromJdbcUrl(explicitJdbc);
            environment.getPropertySources().addFirst(new MapPropertySource("databaseUrlMapping", props));
            return;
        }

        String databaseUrl = firstNonBlank(
                environment.getProperty("DATABASE_URL"),
                environment.getProperty("POSTGRES_URL"),
                explicitJdbc);

        if (databaseUrl == null || databaseUrl.isBlank()) {
            if (onRender) {
                throw new IllegalStateException(
                        "DATABASE_URL is not set on Render. "
                                + "Add your Neon connection string in Environment, e.g. "
                                + "postgresql://USER:PASSWORD@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require "
                                + "then clear build cache & redeploy.");
            }
            return;
        }

        try {
            Map<String, Object> props = parseDatabaseUrl(databaseUrl);
            environment.getPropertySources()
                    .addFirst(new MapPropertySource("databaseUrlMapping", props));
        } catch (Exception ex) {
            throw new IllegalStateException(
                    "Failed to parse DATABASE_URL for JDBC. "
                            + "Use the Neon connection string from the Neon Console → Connect. "
                            + "Example: postgresql://USER:PASSWORD@ep-xxx.region.aws.neon.tech/neondb?sslmode=require",
                    ex);
        }
    }

    static Map<String, Object> parseDatabaseUrl(String raw) throws Exception {
        String normalized = raw.trim().replace("\"", "");
        if (normalized.startsWith("jdbc:")) {
            return fromJdbcUrl(normalized);
        }
        if (normalized.startsWith("postgres://")) {
            normalized = "postgresql://" + normalized.substring("postgres://".length());
        }
        if (!normalized.startsWith("postgresql://")) {
            throw new IllegalArgumentException("Unsupported database URL scheme: " + sanitizeForLog(raw));
        }

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

        String jdbc = "jdbc:postgresql://" + host + ':' + port + '/' + dbName;
        if (query != null && !query.isBlank()) {
            jdbc = jdbc + '?' + query;
        }
        return buildProps(jdbc, username, password);
    }

    static Map<String, Object> fromJdbcUrl(String jdbcUrl) {
        String url = jdbcUrl.trim();
        String username = null;
        String password = null;

        // Neon Java-style: jdbc:postgresql://host/db?user=...&password=...
        int q = url.indexOf('?');
        if (q >= 0) {
            Map<String, String> params = parseQuery(url.substring(q + 1));
            if (params.containsKey("user")) {
                username = params.get("user");
                params.remove("user");
            }
            if (params.containsKey("password")) {
                password = params.get("password");
                params.remove("password");
            }
            String base = url.substring(0, q);
            String rebuilt = params.isEmpty() ? base : base + '?' + joinQuery(params);
            url = rebuilt;
        }

        return buildProps(url, username, password);
    }

    private static Map<String, Object> buildProps(String jdbcUrl, String username, String password) {
        String sanitizedJdbc = sanitizeJdbcQuery(jdbcUrl);
        Map<String, Object> props = new HashMap<>();
        props.put("spring.datasource.url", sanitizedJdbc);
        props.put("DB_URL", sanitizedJdbc);
        if (username != null && !username.isBlank()) {
            props.put("spring.datasource.username", username);
            props.put("DB_USERNAME", username);
        }
        if (password != null) {
            props.put("spring.datasource.password", password);
            props.put("DB_PASSWORD", password);
        }
        return props;
    }

    /**
     * Keep only JDBC-safe params. Convert channel_binding → channelBinding for pgJDBC/Neon.
     * Always require SSL for non-local hosts.
     */
    static String sanitizeJdbcQuery(String jdbcUrl) {
        boolean local = jdbcUrl.toLowerCase(Locale.ROOT).contains("localhost")
                || jdbcUrl.toLowerCase(Locale.ROOT).contains("127.0.0.1");
        int q = jdbcUrl.indexOf('?');
        String base = q >= 0 ? jdbcUrl.substring(0, q) : jdbcUrl;
        Map<String, String> params = q >= 0 ? parseQuery(jdbcUrl.substring(q + 1)) : new LinkedHashMap<>();

        // Normalize Neon channel binding param name for JDBC
        if (params.containsKey("channel_binding") && !params.containsKey("channelBinding")) {
            params.put("channelBinding", params.remove("channel_binding"));
        }

        if (!local) {
            params.putIfAbsent("sslmode", "require");
            // Neon recommends channelBinding for Java; ignore if driver rejects — sslmode is enough to connect.
            params.putIfAbsent("channelBinding", "require");
        }

        // Drop empty values
        params.entrySet().removeIf(e -> e.getValue() == null || e.getValue().isBlank());

        if (params.isEmpty()) {
            return base;
        }
        return base + '?' + joinQuery(params);
    }

    static String ensureSsl(String jdbcUrl) {
        return sanitizeJdbcQuery(jdbcUrl);
    }

    private static Map<String, String> parseQuery(String query) {
        Map<String, String> params = new LinkedHashMap<>();
        if (query == null || query.isBlank()) {
            return params;
        }
        for (String part : query.split("&")) {
            if (part.isBlank()) {
                continue;
            }
            int eq = part.indexOf('=');
            if (eq < 0) {
                params.put(urlDecode(part), "");
            } else {
                params.put(urlDecode(part.substring(0, eq)), urlDecode(part.substring(eq + 1)));
            }
        }
        return params;
    }

    private static String joinQuery(Map<String, String> params) {
        return params.entrySet().stream()
                .map(e -> e.getKey() + "=" + e.getValue())
                .collect(Collectors.joining("&"));
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
        if (hostPort.contains(":")) {
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
