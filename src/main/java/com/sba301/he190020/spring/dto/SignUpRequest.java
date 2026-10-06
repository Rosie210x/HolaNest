package com.sba301.he190020.spring.dto;

import com.sba301.he190020.spring.config.ValidationConstants;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Yêu cầu đăng ký tài khoản mới")
public record SignUpRequest(
        @Schema(description = "Địa chỉ email", example = "user@sba301.com", maxLength = ValidationConstants.EMAIL_MAX)
        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không đúng định dạng")
        @Size(max = ValidationConstants.EMAIL_MAX, message = "Email tối đa 100 ký tự")
        String email,

        @Schema(description = "Mật khẩu", example = "123456", format = "password", maxLength = ValidationConstants.PASSWORD_MAX)
        @NotBlank(message = "Mật khẩu không được để trống")
        @Size(max = ValidationConstants.PASSWORD_MAX, message = "Mật khẩu tối đa 72 ký tự")
        String password,

        @Schema(description = "Vai trò của người dùng", example = "USER", maxLength = ValidationConstants.ROLE_MAX)
        @NotBlank(message = "Role không được để trống")
        @Size(max = ValidationConstants.ROLE_MAX, message = "Role tối đa 20 ký tự")
        String role
) {
}
