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
                "jdbc:postgresql://postgres.railway.internal:5432/railway?sslmode=require",
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
        // localhost should not force SSL
        assertEquals(
                "jdbc:postgresql://localhost:5432/leather_db",
                props.get("spring.datasource.url"));
    }

    @Test
    void convertsNeonUrlAndKeepsSslMode() throws Exception {
        Map<String, Object> props = DatabaseUrlEnvironmentPostProcessor.parseDatabaseUrl(
                "postgresql://neondb_owner:Abc123@ep-cool-name-a1b2c3d4.us-east-2.aws.neon.tech/neondb?sslmode=require");
        assertEquals(
                "jdbc:postgresql://ep-cool-name-a1b2c3d4.us-east-2.aws.neon.tech:5432/neondb?sslmode=require",
                props.get("spring.datasource.url"));
        assertEquals("neondb_owner", props.get("spring.datasource.username"));
        assertEquals("Abc123", props.get("spring.datasource.password"));
    }

    @Test
    void addsSslModeWhenMissingForRemoteHost() throws Exception {
        Map<String, Object> props = DatabaseUrlEnvironmentPostProcessor.parseDatabaseUrl(
                "postgresql://u:p@ep-xxx.aws.neon.tech/neondb");
        assertTrue(String.valueOf(props.get("spring.datasource.url")).contains("sslmode=require"));
    }
}
