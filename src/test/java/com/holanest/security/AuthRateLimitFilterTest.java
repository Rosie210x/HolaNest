package com.holanest.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

class AuthRateLimitFilterTest {

    private final AuthRateLimitFilter filter = new AuthRateLimitFilter(2,
            new ApiErrorWriter(new ObjectMapper().registerModule(new JavaTimeModule())));

    @Test
    @DisplayName("Requests over the limit get 429 with Retry-After; other clients and paths are unaffected")
    void limitsPerClientAndPath() throws Exception {
        assertEquals(200, send("/api/v1/auth/signin", "10.0.0.1").getStatus());
        assertEquals(200, send("/api/v1/auth/signin", "10.0.0.1").getStatus());

        MockHttpServletResponse blocked = send("/api/v1/auth/signin", "10.0.0.1");
        assertEquals(429, blocked.getStatus());
        assertEquals("60", blocked.getHeader("Retry-After"));

        assertEquals(200, send("/api/v1/auth/signin", "10.0.0.2").getStatus());
        assertEquals(200, send("/api/v1/auth/refresh", "10.0.0.1").getStatus());
    }

    private MockHttpServletResponse send(String path, String ip) throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", path);
        request.setRemoteAddr(ip);
        MockHttpServletResponse response = new MockHttpServletResponse();
        filter.doFilter(request, response, new MockFilterChain());
        return response;
    }
}
