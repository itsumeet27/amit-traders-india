package com.amittraders.leather.config;

import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DatabaseUrlEnvironmentPostProcessorTest {

    @Test
    void convertsRailwayStylePostgresqlUrl() throws Exception {
        Map<String, Object> props = DatabaseUrlEnvironmentPostProcessor.parseDatabaseUrl(
                "postgresql://leather:s3cret@postgres.railway.internal:5432/railway");

        String url = String.valueOf(props.get("spring.datasource.url"));
        assertTrue(url.startsWith("jdbc:postgresql://postgres.railway.internal:5432/railway"));
        assertTrue(url.contains("sslmode=require"));
        assertEquals("leather", props.get("spring.datasource.username"));
        assertEquals("s3cret", props.get("spring.datasource.password"));
    }

    @Test
    void convertsPostgresSchemeAliasLocalWithoutSsl() throws Exception {
        Map<String, Object> props = DatabaseUrlEnvironmentPostProcessor.parseDatabaseUrl(
                "postgres://u:p@localhost:5432/leather_db");
        assertEquals("jdbc:postgresql://localhost:5432/leather_db", props.get("spring.datasource.url"));
        assertEquals("u", props.get("DB_USERNAME"));
    }

    @Test
    void convertsNeonUrlAndNormalizesChannelBinding() throws Exception {
        Map<String, Object> props = DatabaseUrlEnvironmentPostProcessor.parseDatabaseUrl(
                "postgresql://neondb_owner:Abc123@ep-cool-name-a1b2c3d4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
        String url = String.valueOf(props.get("spring.datasource.url"));
        assertTrue(url.contains("sslmode=require"));
        assertTrue(url.contains("channelBinding=require"));
        assertFalse(url.contains("channel_binding="));
        assertEquals("neondb_owner", props.get("spring.datasource.username"));
        assertEquals("Abc123", props.get("spring.datasource.password"));
    }

    @Test
    void parsesNeonJdbcStyleUrlWithUserPasswordQueryParams() {
        Map<String, Object> props = DatabaseUrlEnvironmentPostProcessor.fromJdbcUrl(
                "jdbc:postgresql://ep-xxx.us-east-2.aws.neon.tech/neondb?user=neondb_owner&password=Secret&sslmode=require");
        assertEquals("neondb_owner", props.get("spring.datasource.username"));
        assertEquals("Secret", props.get("spring.datasource.password"));
        String url = String.valueOf(props.get("spring.datasource.url"));
        assertFalse(url.contains("user="));
        assertFalse(url.contains("password="));
        assertTrue(url.contains("sslmode=require"));
    }
}
