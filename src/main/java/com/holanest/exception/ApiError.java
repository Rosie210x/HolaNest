package com.holanest.exception;

import java.time.OffsetDateTime;
import java.util.Map;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Chuẩn phản hồi lỗi của REST API (SRS 5.2)")
public record ApiError(
        @Schema(example = "2026-11-02T16:00:00+07:00") OffsetDateTime timestamp,
        @Schema(example = "401") int status,
        @Schema(example = "Unauthorized") String error,
        @Schema(description = "Mã lỗi; MSGxx tương ứng SRS 5.3", example = "MSG03") String code,
        @Schema(example = "Email hoặc mật khẩu không đúng.") String message,
        @Schema(example = "/api/v1/auth/signin") String path,
        @Schema(description = "Lỗi theo từng trường; rỗng nếu không phải lỗi validation") Map<String, String> fieldErrors
) {
    public static ApiError of(ErrorCode errorCode, String path) {
        return of(errorCode, path, Map.of());
    }

    public static ApiError of(ErrorCode errorCode, String path, Map<String, String> fieldErrors) {
        return new ApiError(OffsetDateTime.now(), errorCode.getStatus().value(),
                errorCode.getStatus().getReasonPhrase(), errorCode.getCode(), errorCode.getMessage(), path, fieldErrors);
    }
}
