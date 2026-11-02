package com.holanest.security;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.web.filter.OncePerRequestFilter;

import com.holanest.exception.ErrorCode;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Fixed one-minute window per client IP on the credential endpoints (NFR05). This complements the per-account
 * lock (BR03), which cannot stop one client trying many accounts. Counters live in memory, so the
 * limit is per application instance.
 */
public class AuthRateLimitFilter extends OncePerRequestFilter {

    private static final Set<String> LIMITED_PATHS = Set.of("/api/v1/auth/signin", "/api/v1/auth/signup");
    private static final long WINDOW_MILLIS = 60_000;

    private final int limit;
    private final ApiErrorWriter errorWriter;
    private final Map<String, AtomicInteger> counters = new ConcurrentHashMap<>();
    private volatile long currentWindow;

    public AuthRateLimitFilter(int limit, ApiErrorWriter errorWriter) {
        this.limit = limit;
        this.errorWriter = errorWriter;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !"POST".equals(request.getMethod()) || !LIMITED_PATHS.contains(request.getRequestURI());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        long window = System.currentTimeMillis() / WINDOW_MILLIS;
        if (window != currentWindow) {
            // Dropping old counters also keeps memory bounded
            counters.clear();
            currentWindow = window;
        }
        int count = counters.computeIfAbsent(request.getRemoteAddr(), ip -> new AtomicInteger()).incrementAndGet();
        if (count > limit) {
            response.setHeader("Retry-After", String.valueOf(WINDOW_MILLIS / 1000));
            errorWriter.write(request, response, ErrorCode.TOO_MANY_REQUESTS);
            return;
        }
        filterChain.doFilter(request, response);
    }
}
