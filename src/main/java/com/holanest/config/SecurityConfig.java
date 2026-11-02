package com.holanest.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter.ReferrerPolicy;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.holanest.security.ApiErrorWriter;
import com.holanest.security.AuthRateLimitFilter;
import com.holanest.security.CustomUserDetailsService;
import com.holanest.security.JwtAuthenticationFilter;
import com.holanest.security.JwtService;
import com.holanest.security.RestAccessDeniedHandler;
import com.holanest.security.RestAuthenticationEntryPoint;
import com.holanest.security.SpaCsrfTokenRequestHandler;
import com.holanest.repository.AuthSessionRepository;

import jakarta.servlet.DispatcherType;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    // Swagger UI needs its own scripts and inline styles; everything else stays locked down
    private static final String CONTENT_SECURITY_POLICY =
            "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; "
                    + "object-src 'none'; base-uri 'self'; frame-ancestors 'none'";

    // The filters are created here rather than as beans so Boot does not also register them as servlet filters
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http,
                                            RestAuthenticationEntryPoint authenticationEntryPoint,
                                            RestAccessDeniedHandler accessDeniedHandler,
                                            JwtService jwtService,
                                            AuthSessionRepository sessionRepository,
                                            CustomUserDetailsService userDetailsService,
                                            ApiErrorWriter errorWriter,
                                            SecurityProperties properties) throws Exception {
        http
            .cors(cors -> {})
            // Cookies are sent automatically by the browser, so state-changing requests need a CSRF token
            .csrf(csrf -> csrf
                    .csrfTokenRepository(csrfTokenRepository(properties))
                    .csrfTokenRequestHandler(new SpaCsrfTokenRequestHandler()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())
            .logout(logout -> logout.disable())
            .headers(headers -> headers
                    .contentSecurityPolicy(csp -> csp.policyDirectives(CONTENT_SECURITY_POLICY))
                    .referrerPolicy(referrer -> referrer.policy(ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)))
            .authorizeHttpRequests(auth -> auth
                    .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()
                    .requestMatchers(HttpMethod.POST,
                            "/api/v1/auth/signup",
                            "/api/v1/auth/signin",
                            "/api/v1/auth/refresh",
                            "/api/v1/auth/signout"
                    ).permitAll()
                    .requestMatchers(
                            "/v3/api-docs/**",
                            "/swagger-ui.html",
                            "/swagger-ui/**"
                    ).permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/v1/public/**").permitAll()
                    .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                    // Admin reaches landlord endpoints only for listings posted on behalf (X* in 3.1.3, BR27);
                    // narrow each such endpoint further with @PreAuthorize
                    .requestMatchers("/api/v1/landlord/**").hasAnyRole("LANDLORD", "ADMIN")
                    .requestMatchers("/api/v1/renter/**").hasRole("RENTER")
                    .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                    .authenticationEntryPoint(authenticationEntryPoint)
                    .accessDeniedHandler(accessDeniedHandler))
            .addFilterBefore(new JwtAuthenticationFilter(jwtService, sessionRepository, userDetailsService),
                    UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(new AuthRateLimitFilter(properties.rateLimit().authRequestsPerMinute(), errorWriter),
                    JwtAuthenticationFilter.class);

        return http.build();
    }

    // Double-submit: the frontend must be able to read this cookie to echo it in X-XSRF-TOKEN
    private CookieCsrfTokenRepository csrfTokenRepository(SecurityProperties properties) {
        CookieCsrfTokenRepository repository = CookieCsrfTokenRepository.withHttpOnlyFalse();
        repository.setCookieCustomizer(cookie -> cookie
                .secure(properties.cookie().secure())
                .sameSite(properties.cookie().sameSite())
                .path("/"));
        return repository;
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource(SecurityProperties properties) {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(properties.corsAllowedOrigins());
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Content-Type", "X-XSRF-TOKEN", "X-Requested-With"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
