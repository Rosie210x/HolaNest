package com.sba301.he190020.spring.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Phản hồi đăng nhập thành công chứa JWT Token")
public record SignInResponse(
        @Schema(description = "Access Token dạng JWT Bearer", example = "eyJhbGciOiJIUzI1NiJ9...")
        String token,

        @Schema(description = "Thời gian hết hạn của Token (tính theo giây hoặc miligiây)", example = "86400")
        Long expireIn
) {
}