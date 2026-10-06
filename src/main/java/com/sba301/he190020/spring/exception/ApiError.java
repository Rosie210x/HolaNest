package com.sba301.he190020.spring.exception;

import java.time.OffsetDateTime;
import java.util.Map;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Chuẩn phản hồi lỗi của REST API")
public record ApiError(
        @Schema(example = "2026-09-22T16:00:00+07:00") OffsetDateTime timestamp,
        @Schema(example = "400") int status,
        @Schema(example = "Bad Request") String error,
        @Schema(example = "Dữ liệu không hợp lệ") String message,
        @Schema(example = "/api/v1/customers") String path,
        @Schema(description = "Lỗi theo từng field; rỗng nếu không phải lỗi validation") Map<String, String> fieldErrors
) {
    public ApiError(int status, String error, String message, String path, Map<String, String> fieldErrors) {
        this(OffsetDateTime.now(), status, error, message, path, fieldErrors);
    }

    public ApiError(int status, String error, String message, String path) {
        this(OffsetDateTime.now(), status, error, message, path, null);
    }
}