package com.holanest.service;

import java.time.Instant;
import java.util.Locale;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.holanest.config.SecurityProperties;
import com.holanest.dto.SignInRequest;
import com.holanest.dto.SignUpRequest;
import com.holanest.dto.UserResponse;
import com.holanest.entity.Role;
import com.holanest.entity.User;
import com.holanest.exception.AppException;
import com.holanest.exception.ErrorCode;
import com.holanest.repository.UserRepository;
import com.holanest.security.UserPrincipal;
import com.holanest.service.AuthSessionService.IssuedTokens;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final AuthSessionService sessionService;
    private final SecurityProperties properties;

    // Signs the user in straight away (UC01). Not transactional, so a lost race on the unique email
    // surfaces here as DataIntegrityViolationException.
    public IssuedTokens signup(SignUpRequest request) {
        String email = normalizeEmail(request.email());
        if (userRepository.existsByEmail(email)) {
            throw new AppException(ErrorCode.EMAIL_TAKEN);
        }

        User user = new User();
        user.setEmail(email);
        user.setFullName(request.fullName().trim());
        user.setPhone(request.phone());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.getRoles().add(Role.RENTER);

        try {
            return sessionService.open(userRepository.saveAndFlush(user));
        } catch (DataIntegrityViolationException e) {
            throw new AppException(ErrorCode.EMAIL_TAKEN);
        }
    }

    public IssuedTokens signin(SignInRequest request) {
        String email = normalizeEmail(request.email());
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.password()));
        } catch (BadCredentialsException e) {
            recordFailedLogin(email);
            throw new AppException(ErrorCode.BAD_CREDENTIALS);
        } catch (LockedException e) {
            throw new AppException(ErrorCode.LOGIN_TEMPORARILY_LOCKED);
        } catch (DisabledException e) {
            throw new AppException(ErrorCode.ACCOUNT_LOCKED);
        }

        Long userId = ((UserPrincipal) authentication.getPrincipal()).getId();
        userRepository.resetFailedLogins(userId);
        return sessionService.open(userRepository.findById(userId).orElseThrow());
    }

    public UserResponse currentUser(Long userId) {
        return userRepository.findById(userId)
                .map(UserResponse::from)
                .orElseThrow(() -> new AppException(ErrorCode.SESSION_EXPIRED));
    }

    private void recordFailedLogin(String email) {
        SecurityProperties.Login login = properties.login();
        userRepository.incrementFailedLogins(email);
        userRepository.lockIfAttemptsReached(email, login.maxFailedAttempts(),
                Instant.now().plus(login.lockDuration()));
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
