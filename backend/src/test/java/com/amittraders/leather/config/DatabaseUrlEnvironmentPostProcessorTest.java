package com.amittraders.leather.config;

import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DatabaseUrlEnvironmentPostProcessorTest {

    @Test
    void convertsRailwayStylePostgresqlUrl() throws Exception {
        Map<String, Object> props = DatabaseUrlEnvironmentPostProcessor.parseDatabaseUrl(
                "postgresql://leather:s3cret@postgres.railway.internal:5432/railway");

        assertEquals(
                "jdbc:postgresql://postgres.railway.internal:5432/railway",
                props.get("spring.datasource.url"));
        assertEquals("leather", props.get("spring.datasource.username"));
        assertEquals("s3cret", props.get("spring.datasource.password"));
    }

    @Test
    void convertsPostgresSchemeAlias() throws Exception {
        Map<String, Object> props = DatabaseUrlEnvironmentPostProcessor.parseDatabaseUrl(
                "postgres://u:p@localhost:5432/leather_db");
        assertTrue(String.valueOf(props.get("spring.datasource.url")).startsWith("jdbc:postgresql://"));
        assertEquals("u", props.get("DB_USERNAME"));
    }
}
