package com.sba301.he190020.spring.dto;

import java.math.BigDecimal;

import com.sba301.he190020.spring.config.ValidationConstants;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

@Schema(description = "Yêu cầu tạo hoặc cập nhật thông tin khách hàng")
public record CustomerCreateRequest(
        @Schema(description = "Mã ID khách hàng (Chỉ dùng cho Cập nhật)", example = "1")
        Long customerId,
        @Schema(description = "Họ và tên khách hàng", example = "Nguyen Van A", maxLength = ValidationConstants.CUSTOMER_NAME_MAX)
        @NotBlank(message = "Tên khách hàng không được để trống")
        @Size(max = ValidationConstants.CUSTOMER_NAME_MAX, message = "Tên tối đa 100 ký tự")
        String name,
        @Schema(description = "Địa chỉ email", example = "a.nguyen@gmail.com", maxLength = ValidationConstants.EMAIL_MAX)
        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không đúng định dạng")
        @Size(max = ValidationConstants.EMAIL_MAX, message = "Email tối đa 100 ký tự")
        String email,
        @Schema(description = "Địa chỉ cư trú", example = "123 Le Loi, District 1, HCMC", maxLength = ValidationConstants.CUSTOMER_ADDRESS_MAX)
        @NotBlank(message = "Địa chỉ không được để trống")
        @Size(max = ValidationConstants.CUSTOMER_ADDRESS_MAX, message = "Địa chỉ tối đa 255 ký tự")
        String address,
        @NotBlank(message = "Số điện thoại không được để trống")
        @Pattern(regexp = "^(0|\\+84)[35789]\\d{8}$", message = "Số điện thoại không đúng định dạng")
        @Size(max = ValidationConstants.CUSTOMER_MOBILE_MAX, message = "Số điện thoại tối đa 15 ký tự")
        String mobileNo,
        @NotNull(message = "Doanh thu không được để trống")
        @PositiveOrZero(message = "Doanh thu phải lớn hơn hoặc bằng 0")
        @Digits(integer = 13, fraction = 2, message = "Doanh thu vượt quá giới hạn cho phép")
        BigDecimal revenue
        ) {

}
