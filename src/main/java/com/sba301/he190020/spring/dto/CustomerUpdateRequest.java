package com.sba301.he190020.spring.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

@Schema(description = "Yêu cầu cập nhật khách hàng")
public record CustomerUpdateRequest(
        @Schema(description = "ID khách hàng", example = "1")
        @NotNull(message = "customerId không được để trống")
        Long customerId,

        @Schema(description = "Tên khách hàng", example = "Nguyen Van A")
        @NotBlank(message = "Tên không được để trống")
        String name,

        @Schema(description = "Email khách hàng", example = "customer@gmail.com")
        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không đúng định dạng")
        String email,

        @Schema(description = "Địa chỉ khách hàng", example = "Hanoi, Vietnam")
        @NotBlank(message = "Địa chỉ không được để trống")
        String address,

        @Schema(description = "Số điện thoại", example = "0987654321")
        @NotBlank(message = "Số điện thoại không được để trống")
        String mobileNo,

        @Schema(description = "Doanh thu", example = "2000000.0")
        @NotNull(message = "Revenue không được để trống")
        @PositiveOrZero(message = "Revenue phải lớn hơn hoặc bằng 0")
        Double revenue
) {
}