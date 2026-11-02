package com.holanest.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Thông báo đơn giản từ API")
public record MessageResponse(@Schema(example = "Bạn có quyền truy cập.") String message) {
}
