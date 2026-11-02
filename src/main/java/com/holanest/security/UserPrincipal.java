package com.holanest.security;

import java.time.Instant;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.holanest.entity.User;
import com.holanest.entity.UserStatus;

import lombok.Getter;

@Getter
public class UserPrincipal implements UserDetails {

    private final Long id;
    private final String email;
    private final String passwordHash;
    private final boolean active;
    private final boolean temporarilyLocked;
    private final List<GrantedAuthority> authorities;

    public UserPrincipal(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.passwordHash = user.getPasswordHash();
        this.active = user.getStatus() == UserStatus.ACTIVE;
        this.temporarilyLocked = user.getLockedUntil() != null && user.getLockedUntil().isAfter(Instant.now());
        this.authorities = user.getRoles().stream()
                .<GrantedAuthority>map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                .toList();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    // BR03: DaoAuthenticationProvider checks this before the password, so a correct password is refused too
    @Override
    public boolean isAccountNonLocked() {
        return !temporarilyLocked;
    }

    // BR29: account locked by an Admin
    @Override
    public boolean isEnabled() {
        return active;
    }
}
