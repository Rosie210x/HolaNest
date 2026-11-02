package com.holanest.dto;

import com.holanest.config.ValidationConstants;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Yêu cầu đăng nhập (UC02)")
public record SignInRequest(
        @Schema(description = "Địa chỉ email", example = "khoi.nguyen@gmail.com", maxLength = ValidationConstants.EMAIL_MAX)
        @NotBlank(message = "Vui lòng nhập email.")
        @Email(message = "Email không đúng định dạng.")
        @Size(max = ValidationConstants.EMAIL_MAX, message = "Email tối đa 255 ký tự.")
        String email,

        @Schema(description = "Mật khẩu", example = "matkhau123", format = "password")
        @NotBlank(message = "Vui lòng nhập mật khẩu.")
        @Size(max = ValidationConstants.PASSWORD_MAX_BYTES, message = "Mật khẩu quá dài.")
        String password
) {
}
