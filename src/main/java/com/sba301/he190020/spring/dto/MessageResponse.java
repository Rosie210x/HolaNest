package com.sba301.he190020.spring.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Thông báo đơn giản từ API")
public record MessageResponse(@Schema(example = "Đăng xuất thành công") String message) {
}
