package com.holanest.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.UUID;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.holanest.config.SecurityProperties;
import com.holanest.dto.UserResponse;
import com.holanest.entity.AuthSession;
import com.holanest.entity.User;
import com.holanest.entity.UserStatus;
import com.holanest.exception.AppException;
import com.holanest.exception.ErrorCode;
import com.holanest.repository.AuthSessionRepository;
import com.holanest.security.JwtService;

import lombok.RequiredArgsConstructor;

/**
 * Login sessions with rotating refresh tokens. The token is "sessionId.secret"; only a hash of the secret
 * is stored, so a database leak does not expose usable tokens.
 */
@Service
@RequiredArgsConstructor
public class AuthSessionService {

    /** refreshToken is null when the browser already holds the current one and must keep it. */
    public record IssuedTokens(String accessToken, String refreshToken, UserResponse user) {
    }

    private static final int SECRET_BYTES = 32;

    private final AuthSessionRepository sessionRepository;
    private final JwtService jwtService;
    private final SecurityProperties properties;
    private final SecureRandom secureRandom = new SecureRandom();

    public IssuedTokens open(User user) {
        String secret = newSecret();
        AuthSession session = new AuthSession();
        session.setId(UUID.randomUUID().toString());
        session.setUser(user);
        session.setRefreshTokenHash(hash(secret));
        session.setExpiresAt(Instant.now().plus(properties.jwt().refreshTokenTtl()));
        sessionRepository.save(session);
        return new IssuedTokens(jwtService.createAccessToken(user.getId(), session.getId()),
                session.getId() + "." + secret, UserResponse.from(user));
    }

    // Must not roll back on AppException, otherwise the revocation of a reused token would be undone
    @Transactional(noRollbackFor = AppException.class)
    public IssuedTokens refresh(String refreshToken) {
        String[] parts = split(refreshToken);
        AuthSession session = sessionRepository.findByIdForUpdate(parts[0])
                .orElseThrow(() -> new AppException(ErrorCode.SESSION_EXPIRED));
        Instant now = Instant.now();
        User user = session.getUser();
        if (session.getRevokedAt() != null || session.getExpiresAt().isBefore(now)) {
            throw new AppException(ErrorCode.SESSION_EXPIRED);
        }
        if (user.getStatus() != UserStatus.ACTIVE) {
            session.setRevokedAt(now);
            throw new AppException(ErrorCode.ACCOUNT_LOCKED);
        }

        String presentedHash = hash(parts[1]);
        if (matches(presentedHash, session.getRefreshTokenHash())) {
            String secret = newSecret();
            session.setPreviousTokenHash(session.getRefreshTokenHash());
            session.setRefreshTokenHash(hash(secret));
            session.setRotatedAt(now);
            session.setExpiresAt(now.plus(properties.jwt().refreshTokenTtl()));
            return new IssuedTokens(jwtService.createAccessToken(user.getId(), session.getId()),
                    session.getId() + "." + secret, UserResponse.from(user));
        }
        if (isConcurrentRefresh(session, presentedHash, now)) {
            // Another tab rotated a moment ago and its response carries the new refresh token
            return new IssuedTokens(jwtService.createAccessToken(user.getId(), session.getId()),
                    null, UserResponse.from(user));
        }
        // A rotated or forged token was replayed: assume theft and end the session for both parties
        session.setRevokedAt(now);
        throw new AppException(ErrorCode.SESSION_EXPIRED);
    }

    @Transactional
    public void revoke(String refreshToken) {
        String[] parts = split(refreshToken);
        sessionRepository.findByIdForUpdate(parts[0])
                .filter(session -> {
                    String presented = hash(parts[1]);
                    return matches(presented, session.getRefreshTokenHash())
                            || matches(presented, session.getPreviousTokenHash());
                })
                .ifPresent(session -> session.setRevokedAt(Instant.now()));
    }

    @Scheduled(cron = "0 30 2 * * *", zone = "Asia/Ho_Chi_Minh")
    public void purgeExpired() {
        sessionRepository.deleteExpired(Instant.now());
    }

    private boolean isConcurrentRefresh(AuthSession session, String presentedHash, Instant now) {
        Duration leeway = properties.jwt().refreshReuseLeeway();
        return session.getRotatedAt() != null
                && matches(presentedHash, session.getPreviousTokenHash())
                && session.getRotatedAt().plus(leeway).isAfter(now);
    }

    private String[] split(String refreshToken) {
        String[] parts = refreshToken == null ? new String[0] : refreshToken.split("\\.", 2);
        if (parts.length != 2) {
            throw new AppException(ErrorCode.SESSION_EXPIRED);
        }
        return parts;
    }

    private String newSecret() {
        byte[] bytes = new byte[SECRET_BYTES];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private boolean matches(String presentedHash, String storedHash) {
        return storedHash != null && MessageDigest.isEqual(
                presentedHash.getBytes(StandardCharsets.UTF_8), storedHash.getBytes(StandardCharsets.UTF_8));
    }

    private String hash(String secret) {
        try {
            return HexFormat.of().formatHex(
                    MessageDigest.getInstance("SHA-256").digest(secret.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
