package com.holanest.security;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import com.holanest.config.SecurityProperties;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtService {

    private static final String SESSION_CLAIM = "sid";

    public record AccessClaims(Long userId, String sessionId) {
    }

    private final SecurityProperties.Jwt properties;
    private final SecretKey key;
    private final JwtParser parser;

    public JwtService(SecurityProperties securityProperties) {
        this.properties = securityProperties.jwt();
        // Throws WeakKeyException below 32 bytes, so a weak secret stops the application at startup
        this.key = Keys.hmacShaKeyFor(properties.secret().getBytes(StandardCharsets.UTF_8));
        // parseSignedClaims below rejects unsigned ("alg": "none") tokens
        this.parser = Jwts.parser().verifyWith(key).requireIssuer(properties.issuer()).build();
    }

    public String createAccessToken(Long userId, String sessionId) {
        Instant now = Instant.now();
        return Jwts.builder()
                .issuer(properties.issuer())
                .subject(userId.toString())
                .claim(SESSION_CLAIM, sessionId)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(properties.accessTokenTtl())))
                .signWith(key, Jwts.SIG.HS256)
                .compact();
    }

    public Optional<AccessClaims> parseAccessToken(String token) {
        try {
            Claims claims = parser.parseSignedClaims(token).getPayload();
            return Optional.of(new AccessClaims(
                    Long.valueOf(claims.getSubject()), claims.get(SESSION_CLAIM, String.class)));
        } catch (JwtException | IllegalArgumentException e) {
            return Optional.empty();
        }
    }
}
