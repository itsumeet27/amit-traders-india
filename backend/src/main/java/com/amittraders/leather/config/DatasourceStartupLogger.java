package com.amittraders.leather.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * Logs a sanitized datasource target at boot so Render logs show whether Neon was wired.
 */
@Component
public class DatasourceStartupLogger implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DatasourceStartupLogger.class);

    private final String datasourceUrl;

    public DatasourceStartupLogger(@Value("${spring.datasource.url}") String datasourceUrl) {
        this.datasourceUrl = datasourceUrl;
    }

    @Override
    public void run(ApplicationArguments args) {
        String sanitized = datasourceUrl == null
                ? "<missing>"
                : datasourceUrl.replaceAll("://([^:/@]+):([^@/]+)@", "://$1:***@");
        log.info("Datasource JDBC URL: {}", sanitized);
        if (sanitized.contains("localhost") || sanitized.contains("127.0.0.1")) {
            log.warn(
                    "Datasource points at localhost. On Render you must set DATABASE_URL to your Neon "
                            + "connection string (Dashboard → Environment).");
        }
    }
}
