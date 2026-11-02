package com.holanest.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/** API errors. MSGxx codes and their text come from SRS 5.3; the others have no entry there. */
@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    VALIDATION_FAILED("MSG01", HttpStatus.BAD_REQUEST, "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại."),
    EMAIL_TAKEN("MSG02", HttpStatus.CONFLICT, "Email này đã được sử dụng."),
    BAD_CREDENTIALS("MSG03", HttpStatus.UNAUTHORIZED, "Email hoặc mật khẩu không đúng."),
    LOGIN_TEMPORARILY_LOCKED("MSG04", HttpStatus.LOCKED, "Bạn đã nhập sai quá 5 lần. Vui lòng thử lại sau 15 phút."),
    ACCOUNT_LOCKED("MSG05", HttpStatus.FORBIDDEN, "Tài khoản đã bị khóa. Vui lòng liên hệ bộ phận hỗ trợ."),
    SESSION_EXPIRED("MSG28", HttpStatus.UNAUTHORIZED, "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."),
    INTERNAL_ERROR("MSG29", HttpStatus.INTERNAL_SERVER_ERROR, "Đã có lỗi xảy ra. Vui lòng thử lại sau."),
    TOO_MANY_REQUESTS("MSG31", HttpStatus.TOO_MANY_REQUESTS, "Bạn đã gửi quá số yêu cầu cho phép. Vui lòng thử lại sau."),

    AUTHENTICATION_REQUIRED("AUTH_REQUIRED", HttpStatus.UNAUTHORIZED, "Bạn cần đăng nhập để thực hiện thao tác này."),
    ACCESS_DENIED("ACCESS_DENIED", HttpStatus.FORBIDDEN, "Bạn không có quyền thực hiện thao tác này."),
    CSRF_INVALID("CSRF_INVALID", HttpStatus.FORBIDDEN, "Phiên làm việc không hợp lệ. Vui lòng tải lại trang.");

    private final String code;
    private final HttpStatus status;
    private final String message;
}
