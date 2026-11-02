package com.holanest.dto;

import com.holanest.config.ValidationConstants;
import com.holanest.security.ValidPassword;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// There is deliberately no role field: every new account is a Renter (BR01)
@Schema(description = "Yêu cầu đăng ký tài khoản (UC01)")
public record SignUpRequest(
        @Schema(description = "Họ và tên", example = "Nguyễn Minh Khôi", maxLength = ValidationConstants.FULL_NAME_MAX)
        @NotBlank(message = "Vui lòng nhập họ tên.")
        @Size(max = ValidationConstants.FULL_NAME_MAX, message = "Họ tên tối đa 100 ký tự.")
        String fullName,

        @Schema(description = "Địa chỉ email", example = "khoi.nguyen@gmail.com", maxLength = ValidationConstants.EMAIL_MAX)
        @NotBlank(message = "Vui lòng nhập email.")
        @Email(message = "Email không đúng định dạng.")
        @Size(max = ValidationConstants.EMAIL_MAX, message = "Email tối đa 255 ký tự.")
        String email,

        @Schema(description = "Số điện thoại: 10 chữ số, bắt đầu bằng 0", example = "0987654321")
        @NotBlank(message = "Vui lòng nhập số điện thoại.")
        @Pattern(regexp = ValidationConstants.PHONE_PATTERN, message = "Số điện thoại gồm 10 chữ số, bắt đầu bằng 0.")
        String phone,

        @Schema(description = "Mật khẩu: từ 8 ký tự, có cả chữ và số", example = "matkhau123", format = "password")
        @NotBlank(message = "Vui lòng nhập mật khẩu.")
        @ValidPassword
        String password,

        @Schema(description = "Đồng ý điều khoản sử dụng và chính sách quyền riêng tư", example = "true")
        @AssertTrue(message = "Vui lòng đồng ý điều khoản sử dụng.")
        boolean acceptTerms
) {
}
