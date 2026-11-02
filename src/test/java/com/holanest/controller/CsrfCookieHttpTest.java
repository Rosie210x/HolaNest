package com.holanest.controller;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

/** Over real HTTP, because spring-security-test swaps the CSRF token repository inside MockMvc. */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class CsrfCookieHttpTest {

    private static final String SIGNIN_JSON = "{\"email\":\"nobody@gmail.com\",\"password\":\"matkhau123\"}";

    @LocalServerPort
    private int port;

    private final HttpClient client = HttpClient.newHttpClient();

    @Test
    @DisplayName("Any response issues a script-readable XSRF-TOKEN cookie; the header must match it")
    void doubleSubmitCookie() throws Exception {
        HttpResponse<String> anonymous = client.send(
                HttpRequest.newBuilder(url("/api/v1/auth/me")).GET().build(), HttpResponse.BodyHandlers.ofString());
        assertThat(anonymous.statusCode()).isEqualTo(401);

        String setCookie = anonymous.headers().firstValue("Set-Cookie").orElseThrow();
        assertThat(setCookie).startsWith("XSRF-TOKEN=").contains("SameSite=Strict").doesNotContainIgnoringCase("HttpOnly");
        String token = setCookie.substring("XSRF-TOKEN=".length(), setCookie.indexOf(';'));

        // 401 means the request got past CSRF protection and reached the credential check
        assertThat(signin(token, token).statusCode()).isEqualTo(401);
        assertThat(signin(token, "forged").statusCode()).isEqualTo(403);
    }

    private HttpResponse<String> signin(String cookie, String header) throws Exception {
        return client.send(HttpRequest.newBuilder(url("/api/v1/auth/signin"))
                .header("Content-Type", "application/json")
                .header("Cookie", "XSRF-TOKEN=" + cookie)
                .header("X-XSRF-TOKEN", header)
                .POST(HttpRequest.BodyPublishers.ofString(SIGNIN_JSON))
                .build(), HttpResponse.BodyHandlers.ofString());
    }

    private URI url(String path) {
        return URI.create("http://localhost:" + port + path);
    }
}
