package com.sba301.he190020.spring.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Phản hồi đăng ký tài khoản thành công")
public record SignUpResponse(
        @Schema(description = "ID người dùng", example = "1")
        Long userId,

        @Schema(description = "Email đăng ký", example = "user@gmail.com")
        String email,

        @Schema(description = "Vai trò của người dùng", example = "ADMIN")
        String role
) {
}