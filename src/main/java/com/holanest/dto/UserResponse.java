package com.holanest.dto;

import java.util.Set;

import com.holanest.entity.Role;
import com.holanest.entity.User;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Thông tin tài khoản đang đăng nhập")
public record UserResponse(
        @Schema(example = "1") Long id,
        @Schema(example = "khoi.nguyen@gmail.com") String email,
        @Schema(example = "Nguyễn Minh Khôi") String fullName,
        @Schema(example = "0987654321") String phone,
        String avatarUrl,
        @Schema(description = "Email đã được xác minh hay chưa") boolean emailVerified,
        @Schema(example = "[\"RENTER\"]") Set<Role> roles
) {
    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getFullName(), user.getPhone(),
                user.getAvatarUrl(), user.getEmailVerifiedAt() != null, Set.copyOf(user.getRoles()));
    }
}
