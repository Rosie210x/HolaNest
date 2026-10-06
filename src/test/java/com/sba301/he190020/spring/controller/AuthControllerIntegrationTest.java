package com.sba301.he190020.spring.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sba301.he190020.spring.dto.SignInRequest;
import com.sba301.he190020.spring.dto.SignUpRequest;
import com.sba301.he190020.spring.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @Test
    @DisplayName("IT-Auth-BVA 1: Signup with Password length = 72 (Max Boundary) -> 200 OK")
    void signup_PasswordLength72_Returns200() throws Exception {
        String validPassword = "P".repeat(72);
        SignUpRequest request = new SignUpRequest("user@sba301.com", validPassword, "USER");

        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("IT-Auth-BVA 2: Signup with Password length = 73 (Above Max Boundary) -> 400 Bad Request")
    void signup_PasswordLength73_Returns400() throws Exception {
        String invalidPassword = "P".repeat(73);
        SignUpRequest request = new SignUpRequest("user@sba301.com", invalidPassword, "USER");

        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("IT-Auth-BVA 3: Signin with Email length = 100 (Max Boundary) -> 200 OK")
    void signin_EmailLength100_Returns200() throws Exception {
        String validEmail = "a".repeat(88) + "@sba301.com";
        SignInRequest request = new SignInRequest(validEmail, "123456");

        mockMvc.perform(post("/api/v1/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("IT-Auth-BVA 4: Signin with Email length = 101 (Above Max Boundary) -> 400 Bad Request")
    void signin_EmailLength101_Returns400() throws Exception {
        String invalidEmail = "a".repeat(89) + "@sba301.com";
        SignInRequest request = new SignInRequest(invalidEmail, "123456");

        mockMvc.perform(post("/api/v1/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}