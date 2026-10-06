package com.sba301.he190020.spring.dto;

import com.sba301.he190020.spring.config.ValidationConstants;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Yêu cầu đăng nhập hệ thống")
public record SignInRequest(
        @Schema(description = "Địa chỉ email", example = "admin@sba301.com", maxLength = ValidationConstants.EMAIL_MAX)
        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không đúng định dạng")
        @Size(max = ValidationConstants.EMAIL_MAX, message = "Email tối đa 100 ký tự")
        String email,

        @Schema(description = "Mật khẩu", example = "123456", format = "password", maxLength = ValidationConstants.PASSWORD_MAX)
        @NotBlank(message = "Mật khẩu không được để trống")
        @Size(max = ValidationConstants.PASSWORD_MAX, message = "Mật khẩu tối đa 72 ký tự")
        String password
) {
}