package com.holanest.config;

import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;

import com.holanest.entity.Role;
import com.holanest.entity.User;
import com.holanest.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedData(UserRepository userRepository,
                               PasswordEncoder passwordEncoder,
                               @Value("${app.seed.admin-email:}") String adminEmail,
                               @Value("${app.seed.password:}") String password,
                               @Value("${app.seed.demo-users:false}") boolean demoUsers) {
        return args -> {
            if (!StringUtils.hasText(password)) {
                return;
            }
            String hash = passwordEncoder.encode(password);
            // Admin accounts are created by the system, never through sign-up (BR01)
            if (StringUtils.hasText(adminEmail)) {
                createIfMissing(userRepository, adminEmail, "Quản trị viên", hash, Set.of(Role.ADMIN));
            }
            if (demoUsers) {
                createIfMissing(userRepository, "renter@holanest.local", "Người thuê Demo", hash, Set.of(Role.RENTER));
                createIfMissing(userRepository, "landlord@holanest.local", "Chủ trọ Demo", hash,
                        Set.of(Role.RENTER, Role.LANDLORD));
            }
        };
    }

    private void createIfMissing(UserRepository userRepository, String email, String fullName,
                                 String passwordHash, Set<Role> roles) {
        String normalizedEmail = email.trim().toLowerCase(java.util.Locale.ROOT);
        if (userRepository.existsByEmail(normalizedEmail)) {
            return;
        }
        User user = new User();
        user.setEmail(normalizedEmail);
        user.setFullName(fullName);
        user.setPasswordHash(passwordHash);
        user.getRoles().addAll(roles);
        userRepository.save(user);
    }
}
