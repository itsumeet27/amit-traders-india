package com.amittraders.leather.config;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.util.Map;

/**
 * Hard guarantee that DATABASE_URL (Neon/Render) wins over application.yml localhost defaults.
 * EnvironmentPostProcessor also maps the URL early; this bean is the safety net.
 */
@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Bean
    public DataSource dataSource(Environment env) {
        String databaseUrl = firstNonBlank(
                env.getProperty("DATABASE_URL"),
                env.getProperty("POSTGRES_URL"),
                env.getProperty("DB_URL"),
                env.getProperty("SPRING_DATASOURCE_URL"),
                env.getProperty("spring.datasource.url"));

        String username = firstNonBlank(
                env.getProperty("DB_USERNAME"),
                env.getProperty("SPRING_DATASOURCE_USERNAME"),
                env.getProperty("spring.datasource.username"));
        String password = firstNonBlank(
                env.getProperty("DB_PASSWORD"),
                env.getProperty("SPRING_DATASOURCE_PASSWORD"),
                env.getProperty("spring.datasource.password"));

        boolean onRender = firstNonBlank(
                env.getProperty("RENDER"),
                env.getProperty("RENDER_SERVICE_ID"),
                env.getProperty("RENDER_EXTERNAL_HOSTNAME")) != null;

        if (databaseUrl == null || databaseUrl.isBlank()) {
            throw new IllegalStateException(
                    "No database URL configured. Set DATABASE_URL to your Neon connection string.");
        }

        String jdbcUrl;
        if (databaseUrl.startsWith("jdbc:")) {
            Map<String, Object> props = DatabaseUrlEnvironmentPostProcessor.fromJdbcUrl(databaseUrl);
            jdbcUrl = String.valueOf(props.get("spring.datasource.url"));
            if (props.get("spring.datasource.username") != null) {
                username = String.valueOf(props.get("spring.datasource.username"));
            }
            if (props.get("spring.datasource.password") != null) {
                password = String.valueOf(props.get("spring.datasource.password"));
            }
        } else if (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://")) {
            try {
                Map<String, Object> props = DatabaseUrlEnvironmentPostProcessor.parseDatabaseUrl(databaseUrl);
                jdbcUrl = String.valueOf(props.get("spring.datasource.url"));
                if (props.get("spring.datasource.username") != null) {
                    username = String.valueOf(props.get("spring.datasource.username"));
                }
                if (props.get("spring.datasource.password") != null) {
                    password = String.valueOf(props.get("spring.datasource.password"));
                }
            } catch (Exception ex) {
                throw new IllegalStateException("Failed to parse DATABASE_URL: " + sanitize(databaseUrl), ex);
            }
        } else {
            jdbcUrl = databaseUrl;
        }

        if ((jdbcUrl.contains("localhost") || jdbcUrl.contains("127.0.0.1")) && onRender) {
            throw new IllegalStateException(
                    "Refusing to use localhost database on Render. "
                            + "Set Environment variable DATABASE_URL to your Neon URI "
                            + "(postgresql://USER:PASSWORD@ep-….neon.tech/neondb?sslmode=require), "
                            + "then Clear build cache & deploy. Current value resolved to: "
                            + sanitize(jdbcUrl));
        }

        int poolSize = env.getProperty("DB_POOL_SIZE", Integer.class, 3);

        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl(jdbcUrl);
        if (username != null) {
            ds.setUsername(username);
        }
        if (password != null) {
            ds.setPassword(password);
        }
        ds.setDriverClassName("org.postgresql.Driver");
        ds.setMaximumPoolSize(poolSize);
        ds.setMinimumIdle(0);
        ds.setConnectionTimeout(20_000);
        ds.setPoolName("leather-hikari");

        log.info("Configured DataSource JDBC URL: {}", sanitize(jdbcUrl));
        log.info("Configured DataSource username: {}", username != null ? username : "<none>");
        return ds;
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

    private static String sanitize(String url) {
        if (url == null) {
            return "<null>";
        }
        return url.replaceAll("://([^:/@]+):([^@/]+)@", "://$1:***@")
                .replaceAll("password=[^&]*", "password=***");
    }
}
