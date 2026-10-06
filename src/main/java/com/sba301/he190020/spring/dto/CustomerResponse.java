package com.sba301.he190020.spring.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Thông tin chi tiết khách hàng")
public record CustomerResponse(
        @Schema(description = "ID khách hàng", example = "1")
        Long customerId,

        @Schema(description = "Tên khách hàng", example = "Nguyen Van A")
        String name,

        @Schema(description = "Email khách hàng", example = "customer@gmail.com")
        String email,

        @Schema(description = "Địa chỉ", example = "Hanoi, Vietnam")
        String address,

        @Schema(description = "Số điện thoại", example = "0987654321")
        String mobileNo,

        @Schema(description = "Doanh thu mang lại", example = "1500000.0")
        Double revenue
) {
}