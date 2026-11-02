package com.holanest.config;

import java.time.Duration;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@Validated
@ConfigurationProperties("app.security")
public record SecurityProperties(
        @Valid @NotNull Jwt jwt,
        @Valid @NotNull Cookie cookie,
        @Valid @NotNull Login login,
        @Valid @NotNull RateLimit rateLimit,
        @NotEmpty List<String> corsAllowedOrigins
) {
    public record Jwt(
            @NotBlank String secret,
            @NotBlank String issuer,
            @NotNull Duration accessTokenTtl,
            @NotNull Duration refreshTokenTtl,
            @NotNull Duration refreshReuseLeeway
    ) {
    }

    public record Cookie(boolean secure, @NotBlank String sameSite) {
    }

    public record Login(@Min(1) int maxFailedAttempts, @NotNull Duration lockDuration) {
    }

    public record RateLimit(@Min(1) int authRequestsPerMinute) {
    }
}
