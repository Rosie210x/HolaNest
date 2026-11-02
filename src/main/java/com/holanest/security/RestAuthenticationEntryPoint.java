package com.holanest.security;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import com.holanest.exception.ErrorCode;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ApiErrorWriter errorWriter;

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        // A cookie that did not authenticate means the session ended; no cookie means never signed in
        boolean hadSession = WebUtils.getCookie(request, AuthCookies.ACCESS_TOKEN) != null;
        errorWriter.write(request, response,
                hadSession ? ErrorCode.SESSION_EXPIRED : ErrorCode.AUTHENTICATION_REQUIRED);
    }
}
