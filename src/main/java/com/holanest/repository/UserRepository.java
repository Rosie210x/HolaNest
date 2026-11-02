package com.holanest.repository;

import java.time.Instant;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.holanest.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Transactional
    @Modifying
    @Query("update User u set u.failedLoginCount = u.failedLoginCount + 1 where u.email = :email")
    int incrementFailedLogins(String email);

    @Transactional
    @Modifying
    @Query("""
            update User u set u.lockedUntil = :lockedUntil, u.failedLoginCount = 0
            where u.email = :email and u.failedLoginCount >= :maxAttempts
            """)
    int lockIfAttemptsReached(String email, int maxAttempts, Instant lockedUntil);

    @Transactional
    @Modifying
    @Query("update User u set u.failedLoginCount = 0, u.lockedUntil = null where u.id = :id")
    int resetFailedLogins(Long id);
}
