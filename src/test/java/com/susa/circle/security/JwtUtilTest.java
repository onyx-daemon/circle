package com.susa.circle.security;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Date;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

class JwtUtilTest {

    private JwtUtil jwtUtil;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();

        // Set test values for JWT secret and expiration
        ReflectionTestUtils.setField(
            jwtUtil,
            "secret",
            "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970"
        );
        ReflectionTestUtils.setField(jwtUtil, "expiration", 86400000L);

        userDetails = new CustomUserDetails(
            1L,
            "test@example.com",
            "password",
            true
        );
    }

    @Test
    void testGenerateToken() {
        String token = jwtUtil.generateToken(userDetails);

        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void testExtractUsername() {
        String token = jwtUtil.generateToken(userDetails);
        String username = jwtUtil.extractUsername(token);

        assertEquals("test@example.com", username);
    }

    @Test
    void testExtractExpiration() {
        String token = jwtUtil.generateToken(userDetails);
        Date expiration = jwtUtil.extractExpiration(token);

        assertNotNull(expiration);
        assertTrue(expiration.after(new Date()));
    }

    @Test
    void testValidateToken_Valid() {
        String token = jwtUtil.generateToken(userDetails);
        Boolean isValid = jwtUtil.validateToken(token, userDetails);

        assertTrue(isValid);
    }

    @Test
    void testValidateToken_InvalidUsername() {
        String token = jwtUtil.generateToken(userDetails);
        UserDetails differentUser = new CustomUserDetails(
            2L,
            "different@example.com",
            "password",
            true
        );

        Boolean isValid = jwtUtil.validateToken(token, differentUser);

        assertFalse(isValid);
    }

    @Test
    void testValidateToken_ExpiredToken() {
        // Set very short expiration
        ReflectionTestUtils.setField(jwtUtil, "expiration", -1L);

        String token = jwtUtil.generateToken(userDetails);

        // Reset to normal expiration
        ReflectionTestUtils.setField(jwtUtil, "expiration", 86400000L);

        Boolean isValid = jwtUtil.validateToken(token, userDetails);

        assertFalse(isValid);
    }

    @Test
    void testValidateToken_InvalidToken() {
        String invalidToken = "invalid.token.here";

        Boolean isValid = jwtUtil.validateToken(invalidToken, userDetails);

        assertFalse(isValid);
    }

    @Test
    void testTokenExpirationTime() {
        String token = jwtUtil.generateToken(userDetails);
        Date expiration = jwtUtil.extractExpiration(token);
        Date now = new Date();

        long timeDiff = expiration.getTime() - now.getTime();

        // Should be approximately 24 hours (86400000 ms)
        assertTrue(timeDiff > 86000000L && timeDiff <= 86400000L);
    }
}
