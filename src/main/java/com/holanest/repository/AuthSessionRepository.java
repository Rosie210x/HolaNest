package com.holanest.repository;

import java.time.Instant;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.holanest.entity.AuthSession;

import jakarta.persistence.LockModeType;

public interface AuthSessionRepository extends JpaRepository<AuthSession, String> {

    // Serializes concurrent refreshes of one session so a rotation is never lost
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from AuthSession s join fetch s.user where s.id = :id")
    Optional<AuthSession> findByIdForUpdate(String id);

    boolean existsByIdAndRevokedAtIsNullAndExpiresAtAfter(String id, Instant now);

    @Transactional
    @Modifying
    @Query("delete from AuthSession s where s.expiresAt < :now")
    int deleteExpired(Instant now);
}
