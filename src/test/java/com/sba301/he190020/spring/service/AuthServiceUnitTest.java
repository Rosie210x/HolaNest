package com.sba301.he190020.spring.service;

import com.sba301.he190020.spring.config.JwtTokenProvider;
import com.sba301.he190020.spring.dto.SignInRequest;
import com.sba301.he190020.spring.dto.SignInResponse;
import com.sba301.he190020.spring.dto.SignUpRequest;
import com.sba301.he190020.spring.dto.SignUpResponse;
import com.sba301.he190020.spring.entity.AppUser;
import com.sba301.he190020.spring.entity.Role;
import com.sba301.he190020.spring.repository.AppUserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceUnitTest {

    @Mock
    private AppUserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthService authService;

    // --- SIGNUP: STATEMENT & DECISION COVERAGE ---

    @Test
    @DisplayName("UT-Auth 1: signup() - Decision TRUE (Email Exists) -> Statement throws RuntimeException")
    void signup_EmailExists_ThrowsRuntimeException() {
        SignUpRequest request = new SignUpRequest("user@sba301.com", "123456", "USER");
        when(userRepository.existsByEmailIgnoreCase("user@sba301.com")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.signup(request));

        assertEquals("Email đã tồn tại!", ex.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("UT-Auth 2: signup() - Decision FALSE (Email Unique) -> Statement saves user and returns SignUpResponse")
    void signup_ValidRequest_ReturnsSignUpResponse() {
        SignUpRequest request = new SignUpRequest("user@sba301.com", "123456", "USER");
        AppUser savedUser = new AppUser(1L, "user@sba301.com", "encodedPassword", Role.USER);

        when(userRepository.existsByEmailIgnoreCase("user@sba301.com")).thenReturn(false);
        when(passwordEncoder.encode("123456")).thenReturn("encodedPassword");
        when(userRepository.save(any(AppUser.class))).thenReturn(savedUser);

        SignUpResponse response = authService.signup(request);

        assertNotNull(response);
        assertEquals(1L, response.userId());
        assertEquals("user@sba301.com", response.email());
        assertEquals("USER", response.role());
        verify(userRepository, times(1)).save(any(AppUser.class));
    }


    @Test
    @DisplayName("UT-Auth 3: signin() - Valid Authentication -> Statement generates and returns JWT Token")
    void signin_ValidCredentials_ReturnsSignInResponse() {
        SignInRequest request = new SignInRequest("admin@sba301.com", "123456");
        Authentication authentication = mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(jwtTokenProvider.generateToken(authentication)).thenReturn("mocked-jwt-token");
        when(jwtTokenProvider.getExpirationTime()).thenReturn(3600000L);

        SignInResponse response = authService.signin(request);

        assertNotNull(response);
        assertEquals("mocked-jwt-token", response.token());
        assertEquals(3600000L, response.expireIn());
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }
}