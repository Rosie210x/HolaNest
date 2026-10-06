package com.sba301.he190020.spring.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sba301.he190020.spring.config.JwtTokenProvider;
import com.sba301.he190020.spring.dto.SignInRequest;
import com.sba301.he190020.spring.dto.SignInResponse;
import com.sba301.he190020.spring.dto.SignUpRequest;
import com.sba301.he190020.spring.dto.SignUpResponse;
import com.sba301.he190020.spring.entity.AppUser;
import com.sba301.he190020.spring.entity.Role;
import com.sba301.he190020.spring.repository.AppUserRepository;
 
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

public SignUpResponse signup(SignUpRequest request) {
    if (userRepository.existsByEmailIgnoreCase(request.email())) {
        throw new RuntimeException("Email đã tồn tại!");
    }

    AppUser user = new AppUser();
    user.setEmail(request.email());
    user.setPassword(passwordEncoder.encode(request.password()));
    
    user.setRole(Role.valueOf(request.role().toUpperCase()));

    AppUser savedUser = userRepository.save(user);

    return new SignUpResponse(
        savedUser.getId(), 
        savedUser.getEmail(), 
        savedUser.getRole().name()
    );
}

    public SignInResponse signin(SignInRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        String token = jwtTokenProvider.generateToken(authentication);
        long expireIn = jwtTokenProvider.getExpirationTime();

        return new SignInResponse(token, expireIn);
    }
}
