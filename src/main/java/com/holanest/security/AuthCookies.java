package com.holanest.security;

import java.time.Duration;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import com.holanest.config.SecurityProperties;

import jakarta.servlet.http.HttpServletResponse;

/** Writes the token cookies: httpOnly so scripts cannot read them, and scoped to the paths that use them. */
@Component
public class AuthCookies {

    public static final String ACCESS_TOKEN = "access_token";
    public static final String REFRESH_TOKEN = "refresh_token";
    private static final String ACCESS_PATH = "/api";
    // The refresh token is only ever sent to the auth endpoints
    private static final String REFRESH_PATH = "/api/v1/auth";

    private final SecurityProperties properties;

    public AuthCookies(SecurityProperties properties) {
        this.properties = properties;
    }

    public void addAccessToken(HttpServletResponse response, String token) {
        add(response, ACCESS_TOKEN, token, ACCESS_PATH, properties.jwt().accessTokenTtl());
    }

    public void addRefreshToken(HttpServletResponse response, String token) {
        add(response, REFRESH_TOKEN, token, REFRESH_PATH, properties.jwt().refreshTokenTtl());
    }

    public void clear(HttpServletResponse response) {
        add(response, ACCESS_TOKEN, "", ACCESS_PATH, Duration.ZERO);
        add(response, REFRESH_TOKEN, "", REFRESH_PATH, Duration.ZERO);
    }

    private void add(HttpServletResponse response, String name, String value, String path, Duration maxAge) {
        ResponseCookie cookie = ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(properties.cookie().secure())
                .sameSite(properties.cookie().sameSite())
                .path(path)
                .maxAge(maxAge)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
