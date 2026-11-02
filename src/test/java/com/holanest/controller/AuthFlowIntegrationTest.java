package com.holanest.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.holanest.entity.AuthSession;
import com.holanest.entity.Role;
import com.holanest.entity.User;
import com.holanest.entity.UserStatus;
import com.holanest.repository.AuthSessionRepository;
import com.holanest.repository.UserRepository;
import com.holanest.security.AuthCookies;

import jakarta.servlet.http.Cookie;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthFlowIntegrationTest {

    private static final String PASSWORD = "matkhau123";
    private static final String ME = "/api/v1/auth/me";

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AuthSessionRepository sessionRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void cleanDatabase() {
        sessionRepository.deleteAll();
        userRepository.deleteAll();
    }

    // --- Sign-up ---

    @Test
    @DisplayName("Sign-up creates a Renter, signs in via secure httpOnly cookies and returns no token in the body")
    void signup_setsSecureCookies() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/v1/auth/signup").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(signupJson("Khoi.Nguyen@Gmail.com", PASSWORD)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("khoi.nguyen@gmail.com"))
                .andExpect(jsonPath("$.roles[0]").value("RENTER"))
                .andExpect(jsonPath("$.token").doesNotExist())
                .andExpect(cookie().httpOnly(AuthCookies.ACCESS_TOKEN, true))
                .andExpect(cookie().secure(AuthCookies.ACCESS_TOKEN, true))
                .andExpect(cookie().sameSite(AuthCookies.ACCESS_TOKEN, "Strict"))
                .andExpect(cookie().path(AuthCookies.ACCESS_TOKEN, "/api"))
                .andExpect(cookie().maxAge(AuthCookies.ACCESS_TOKEN, 15 * 60))
                .andExpect(cookie().httpOnly(AuthCookies.REFRESH_TOKEN, true))
                .andExpect(cookie().path(AuthCookies.REFRESH_TOKEN, "/api/v1/auth"))
                .andExpect(cookie().maxAge(AuthCookies.REFRESH_TOKEN, 7 * 24 * 60 * 60))
                .andReturn();

        User saved = userRepository.findByEmail("khoi.nguyen@gmail.com").orElseThrow();
        assertThat(saved.getPasswordHash()).startsWith("$2").doesNotContain(PASSWORD);
        String refresh = result.getResponse().getCookie(AuthCookies.REFRESH_TOKEN).getValue();
        AuthSession session = sessionRepository.findAll().get(0);
        assertThat(session.getRefreshTokenHash()).isNotEqualTo(refresh);
    }

    @Test
    @DisplayName("A role field in the sign-up body cannot grant Admin (BR01)")
    void signup_ignoresRequestedRole() throws Exception {
        String json = signupJson("a@gmail.com", PASSWORD).replaceFirst("\\{", "{\"role\":\"ADMIN\",\"roles\":[\"ADMIN\"],");
        mockMvc.perform(post("/api/v1/auth/signup").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.roles.length()").value(1))
                .andExpect(jsonPath("$.roles[0]").value("RENTER"));
    }

    @Test
    @DisplayName("Duplicate email in different case -> 409 MSG02")
    void signup_duplicateEmail() throws Exception {
        createUser("dup@gmail.com", Role.RENTER);
        mockMvc.perform(post("/api/v1/auth/signup").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON).content(signupJson("DUP@gmail.com", PASSWORD)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("MSG02"));
    }

    @Test
    @DisplayName("Password rules and field errors follow BR02 and the common error format")
    void signup_invalidFields() throws Exception {
        String json = """
                {"fullName":" ","email":"not-an-email","phone":"123","password":"onlyletters","acceptTerms":false}""";
        mockMvc.perform(post("/api/v1/auth/signup").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("MSG01"))
                .andExpect(jsonPath("$.path").value("/api/v1/auth/signup"))
                .andExpect(jsonPath("$.fieldErrors.fullName").exists())
                .andExpect(jsonPath("$.fieldErrors.email").exists())
                .andExpect(jsonPath("$.fieldErrors.phone").exists())
                .andExpect(jsonPath("$.fieldErrors.password").exists())
                .andExpect(jsonPath("$.fieldErrors.acceptTerms").exists());
    }

    @Test
    @DisplayName("Password over BCrypt's 72 bytes in multibyte characters -> 400, not 500")
    void signup_passwordOver72Bytes() throws Exception {
        mockMvc.perform(post("/api/v1/auth/signup").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(signupJson("long@gmail.com", "ệ".repeat(30) + "1")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.password").exists());
    }

    // --- Sign-in and lockout ---

    @Test
    @DisplayName("Wrong password and unknown email give the same 401 MSG03")
    void signin_badCredentials() throws Exception {
        createUser("user@gmail.com", Role.RENTER);
        signin("user@gmail.com", "wrong-pass1").andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("MSG03"));
        signin("nobody@gmail.com", "wrong-pass1").andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("MSG03"));
    }

    @Test
    @DisplayName("After 5 wrong passwords the 6th attempt is refused even when correct (BR03)")
    void signin_locksAfterFiveFailures() throws Exception {
        createUser("user@gmail.com", Role.RENTER);
        for (int i = 0; i < 5; i++) {
            signin("user@gmail.com", "wrong-pass1").andExpect(status().isUnauthorized());
        }
        signin("user@gmail.com", PASSWORD)
                .andExpect(status().isLocked())
                .andExpect(jsonPath("$.code").value("MSG04"));
    }

    @Test
    @DisplayName("A successful sign-in resets the failure counter")
    void signin_resetsCounter() throws Exception {
        createUser("user@gmail.com", Role.RENTER);
        for (int i = 0; i < 4; i++) {
            signin("user@gmail.com", "wrong-pass1").andExpect(status().isUnauthorized());
        }
        signin("user@gmail.com", PASSWORD).andExpect(status().isOk());
        signin("user@gmail.com", "wrong-pass1").andExpect(status().isUnauthorized());
        signin("user@gmail.com", PASSWORD).andExpect(status().isOk());
    }

    @Test
    @DisplayName("Temporary lock expires by itself")
    void signin_lockExpires() throws Exception {
        User user = createUser("user@gmail.com", Role.RENTER);
        user.setLockedUntil(Instant.now().minusSeconds(1));
        userRepository.save(user);
        signin("user@gmail.com", PASSWORD).andExpect(status().isOk());
    }

    @Test
    @DisplayName("Locking an account blocks sign-in (MSG05) and ends sessions already open (BR29)")
    void lockedAccount() throws Exception {
        User user = createUser("user@gmail.com", Role.RENTER);
        MvcResult login = signin("user@gmail.com", PASSWORD).andExpect(status().isOk()).andReturn();
        user = userRepository.findById(user.getId()).orElseThrow();
        user.setStatus(UserStatus.LOCKED);
        userRepository.save(user);

        mockMvc.perform(get(ME).cookie(access(login))).andExpect(status().isUnauthorized());
        mockMvc.perform(post("/api/v1/auth/refresh").with(csrf()).cookie(refresh(login)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("MSG05"));
        signin("user@gmail.com", PASSWORD)
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("MSG05"));
    }

    // --- CSRF ---

    @Test
    @DisplayName("State-changing requests without a CSRF token -> 403 CSRF_INVALID")
    void csrf_required() throws Exception {
        mockMvc.perform(post("/api/v1/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"a@gmail.com\",\"password\":\"x\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("CSRF_INVALID"));
    }

    // --- Session lifecycle ---

    @Test
    @DisplayName("Anonymous request -> 401 in the common format")
    void me_anonymous() throws Exception {
        mockMvc.perform(get(ME)).andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH_REQUIRED"))
                .andExpect(jsonPath("$.path").value(ME));
    }

    @Test
    @DisplayName("Sign-out clears cookies, and replaying the old tokens no longer works (UC02)")
    void signout_revokes() throws Exception {
        createUser("user@gmail.com", Role.RENTER);
        MvcResult login = signin("user@gmail.com", PASSWORD).andReturn();
        mockMvc.perform(get(ME).cookie(access(login))).andExpect(status().isOk());

        mockMvc.perform(post("/api/v1/auth/signout").with(csrf()).cookie(refresh(login)))
                .andExpect(status().isNoContent())
                .andExpect(cookie().maxAge(AuthCookies.ACCESS_TOKEN, 0))
                .andExpect(cookie().maxAge(AuthCookies.REFRESH_TOKEN, 0));

        mockMvc.perform(get(ME).cookie(access(login))).andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("MSG28"));
        mockMvc.perform(post("/api/v1/auth/refresh").with(csrf()).cookie(refresh(login)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Refresh rotates the token and keeps the same session valid")
    void refresh_rotates() throws Exception {
        createUser("user@gmail.com", Role.RENTER);
        MvcResult login = signin("user@gmail.com", PASSWORD).andReturn();

        MvcResult refreshed = mockMvc.perform(post("/api/v1/auth/refresh").with(csrf()).cookie(refresh(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("user@gmail.com"))
                .andReturn();

        assertThat(refresh(refreshed).getValue()).isNotEqualTo(refresh(login).getValue());
        mockMvc.perform(get(ME).cookie(access(refreshed))).andExpect(status().isOk());
    }

    @Test
    @DisplayName("Two tabs refreshing together: the late one gets an access token and does not overwrite the refresh cookie")
    void refresh_concurrentWithinLeeway() throws Exception {
        createUser("user@gmail.com", Role.RENTER);
        MvcResult login = signin("user@gmail.com", PASSWORD).andReturn();
        mockMvc.perform(post("/api/v1/auth/refresh").with(csrf()).cookie(refresh(login))).andExpect(status().isOk());

        MvcResult late = mockMvc.perform(post("/api/v1/auth/refresh").with(csrf()).cookie(refresh(login)))
                .andExpect(status().isOk())
                .andExpect(cookie().exists(AuthCookies.ACCESS_TOKEN))
                .andExpect(cookie().doesNotExist(AuthCookies.REFRESH_TOKEN))
                .andReturn();
        mockMvc.perform(get(ME).cookie(access(late))).andExpect(status().isOk());
    }

    @Test
    @DisplayName("Replaying a rotated refresh token after the leeway revokes the whole session")
    void refresh_reuseRevokesSession() throws Exception {
        createUser("user@gmail.com", Role.RENTER);
        MvcResult login = signin("user@gmail.com", PASSWORD).andReturn();
        MvcResult rotated = mockMvc.perform(post("/api/v1/auth/refresh").with(csrf()).cookie(refresh(login)))
                .andExpect(status().isOk()).andReturn();

        AuthSession session = sessionRepository.findAll().get(0);
        session.setRotatedAt(Instant.now().minusSeconds(60));
        sessionRepository.save(session);

        mockMvc.perform(post("/api/v1/auth/refresh").with(csrf()).cookie(refresh(login)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("MSG28"))
                .andExpect(cookie().maxAge(AuthCookies.REFRESH_TOKEN, 0));

        // The legitimate holder of the newest tokens is signed out too
        mockMvc.perform(get(ME).cookie(access(rotated))).andExpect(status().isUnauthorized());
        mockMvc.perform(post("/api/v1/auth/refresh").with(csrf()).cookie(refresh(rotated)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("A refresh token cannot be used as an access token, and malformed cookies are just rejected")
    void refresh_malformedAndMisused() throws Exception {
        createUser("user@gmail.com", Role.RENTER);
        MvcResult login = signin("user@gmail.com", PASSWORD).andReturn();

        mockMvc.perform(get(ME).cookie(new Cookie(AuthCookies.ACCESS_TOKEN, refresh(login).getValue())))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(post("/api/v1/auth/refresh").with(csrf()).cookie(new Cookie(AuthCookies.REFRESH_TOKEN, "garbage")))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(post("/api/v1/auth/refresh").with(csrf())).andExpect(status().isUnauthorized());
        mockMvc.perform(post("/api/v1/auth/signout").with(csrf()).cookie(new Cookie(AuthCookies.REFRESH_TOKEN, "garbage")))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("Tampered and unsigned JWTs are rejected")
    void jwt_tamperedAndUnsigned() throws Exception {
        createUser("user@gmail.com", Role.RENTER);
        MvcResult login = signin("user@gmail.com", PASSWORD).andReturn();
        String[] jwt = access(login).getValue().split("\\.");

        String forgedPayload = encode("{\"iss\":\"hola-nest\",\"sub\":\"999\",\"sid\":\"x\"}");
        mockMvc.perform(get(ME).cookie(new Cookie(AuthCookies.ACCESS_TOKEN, jwt[0] + "." + forgedPayload + "." + jwt[2])))
                .andExpect(status().isUnauthorized());

        String unsigned = encode("{\"alg\":\"none\"}") + "." + jwt[1] + ".";
        mockMvc.perform(get(ME).cookie(new Cookie(AuthCookies.ACCESS_TOKEN, unsigned)))
                .andExpect(status().isUnauthorized());
    }

    // --- RBAC ---

    @Test
    @DisplayName("RBAC: Renter reaches only renter endpoints")
    void rbac_renter() throws Exception {
        createUser("r@gmail.com", Role.RENTER);
        assertAccess(signin("r@gmail.com", PASSWORD).andReturn(), 200, 403, 403);
    }

    @Test
    @DisplayName("RBAC: Landlord keeps Renter rights and gains landlord endpoints")
    void rbac_landlord() throws Exception {
        createUser("l@gmail.com", Role.RENTER, Role.LANDLORD);
        assertAccess(signin("l@gmail.com", PASSWORD).andReturn(), 200, 200, 403);
    }

    @Test
    @DisplayName("RBAC: Admin reaches admin endpoints but not role-specific landlord or renter ones")
    void rbac_admin() throws Exception {
        createUser("a@gmail.com", Role.ADMIN);
        assertAccess(signin("a@gmail.com", PASSWORD).andReturn(), 403, 403, 200);
    }

    @Test
    @DisplayName("RBAC: anonymous -> 401 on every protected endpoint")
    void rbac_anonymous() throws Exception {
        for (String path : Set.of("renter", "landlord", "admin")) {
            mockMvc.perform(get("/api/v1/" + path + "/access-check")).andExpect(status().isUnauthorized());
        }
    }

    @Test
    @DisplayName("Granting a role applies on the next request without signing in again (UC23)")
    void rbac_roleChangeAppliesImmediately() throws Exception {
        User user = createUser("r@gmail.com", Role.RENTER);
        MvcResult login = signin("r@gmail.com", PASSWORD).andReturn();
        mockMvc.perform(get("/api/v1/landlord/access-check").cookie(access(login))).andExpect(status().isForbidden());

        user = userRepository.findById(user.getId()).orElseThrow();
        user.getRoles().add(Role.LANDLORD);
        userRepository.save(user);

        mockMvc.perform(get("/api/v1/landlord/access-check").cookie(access(login))).andExpect(status().isOk());
        mockMvc.perform(get(ME).cookie(access(login)))
                .andExpect(jsonPath("$.roles", containsInAnyOrder("RENTER", "LANDLORD")));
    }

    // --- Global errors and documentation ---

    @Test
    @DisplayName("Framework errors use the common format: 404, 405, malformed JSON")
    void globalErrors() throws Exception {
        createUser("user@gmail.com", Role.RENTER);
        MvcResult login = signin("user@gmail.com", PASSWORD).andReturn();

        mockMvc.perform(get("/api/v1/does-not-exist").cookie(access(login)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("HTTP_404"))
                .andExpect(jsonPath("$.path").value("/api/v1/does-not-exist"));
        mockMvc.perform(put(ME).with(csrf()).cookie(access(login)))
                .andExpect(status().isMethodNotAllowed())
                .andExpect(jsonPath("$.code").value("HTTP_405"));
        mockMvc.perform(post("/api/v1/auth/signin").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON).content("{broken"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("MSG01"));
    }

    @Test
    @DisplayName("Swagger and the OpenAPI document are public; the document describes cookie auth")
    void swagger() throws Exception {
        mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.info.title").value("Hola Nest REST API"))
                .andExpect(jsonPath("$.components.securitySchemes.cookieAuth.in").value("cookie"))
                .andExpect(jsonPath("$.paths['/api/v1/auth/signin'].post").exists())
                .andExpect(jsonPath("$.paths['/api/v1/admin/access-check'].get").exists())
                .andExpect(jsonPath("$.components.schemas.ApiError").exists());
        mockMvc.perform(get("/swagger-ui/index.html"))
                .andExpect(status().isOk())
                .andExpect(header().exists("Content-Security-Policy"))
                .andExpect(header().string("X-Content-Type-Options", "nosniff"));
    }

    // --- Helpers ---

    private void assertAccess(MvcResult login, int renter, int landlord, int admin) throws Exception {
        mockMvc.perform(get("/api/v1/renter/access-check").cookie(access(login))).andExpect(status().is(renter));
        mockMvc.perform(get("/api/v1/landlord/access-check").cookie(access(login))).andExpect(status().is(landlord));
        mockMvc.perform(get("/api/v1/admin/access-check").cookie(access(login))).andExpect(status().is(admin));
    }

    private org.springframework.test.web.servlet.ResultActions signin(String email, String password) throws Exception {
        return mockMvc.perform(post("/api/v1/auth/signin").with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"%s\",\"password\":\"%s\"}".formatted(email, password)));
    }

    private User createUser(String email, Role... roles) {
        User user = new User();
        user.setEmail(email);
        user.setFullName("Test User");
        user.setPasswordHash(passwordEncoder.encode(PASSWORD));
        user.getRoles().addAll(Set.of(roles));
        return userRepository.save(user);
    }

    private String signupJson(String email, String password) {
        return """
                {"fullName":"Nguyễn Minh Khôi","email":"%s","phone":"0987654321","password":"%s","acceptTerms":true}"""
                .formatted(email, password);
    }

    private Cookie access(MvcResult result) {
        return result.getResponse().getCookie(AuthCookies.ACCESS_TOKEN);
    }

    private Cookie refresh(MvcResult result) {
        return result.getResponse().getCookie(AuthCookies.REFRESH_TOKEN);
    }

    private String encode(String json) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(json.getBytes(StandardCharsets.UTF_8));
    }
}
