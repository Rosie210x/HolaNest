package com.holanest.security;

import java.io.IOException;
import java.time.Instant;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;

import com.holanest.repository.AuthSessionRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/**
 * Authenticates from the access token cookie. The session and the user are re-read on every request, so
 * sign-out, a locked account (BR29) and a granted or revoked role all apply at once instead of when
 * the 15-minute JWT expires. An invalid token just leaves the request anonymous.
 */
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final AuthSessionRepository sessionRepository;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        Cookie cookie = WebUtils.getCookie(request, AuthCookies.ACCESS_TOKEN);
        if (cookie != null) {
            jwtService.parseAccessToken(cookie.getValue())
                    .filter(claims -> sessionRepository.existsByIdAndRevokedAtIsNullAndExpiresAtAfter(
                            claims.sessionId(), Instant.now()))
                    .ifPresent(this::authenticate);
        }
        filterChain.doFilter(request, response);
    }

    private void authenticate(JwtService.AccessClaims claims) {
        try {
            UserPrincipal principal = userDetailsService.loadById(claims.userId());
            if (principal.isEnabled()) {
                SecurityContextHolder.getContext().setAuthentication(
                        UsernamePasswordAuthenticationToken.authenticated(principal, null, principal.getAuthorities()));
            }
        } catch (UsernameNotFoundException e) {
            SecurityContextHolder.clearContext();
        }
    }
}
