package com.holanest.exception;

import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;

/**
 * Turns every exception raised behind the DispatcherServlet into an {@link ApiError}.
 * The base class covers Spring MVC's own exceptions (405, 415, missing parameter, unknown path...).
 */
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiError> handleApp(AppException ex, HttpServletRequest request) {
        return respond(ApiError.of(ex.getErrorCode(), request.getRequestURI()));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiError> handleConstraint(ConstraintViolationException ex, HttpServletRequest request) {
        Map<String, String> fields = new LinkedHashMap<>();
        ex.getConstraintViolations().forEach(v -> fields.put(v.getPropertyPath().toString(), v.getMessage()));
        return respond(ApiError.of(ErrorCode.VALIDATION_FAILED, request.getRequestURI(), fields));
    }

    // Raised by @PreAuthorize inside the MVC layer, so it arrives here and not at the security filter chain
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        return respond(ApiError.of(ErrorCode.ACCESS_DENIED, request.getRequestURI()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleUnexpected(Exception ex, HttpServletRequest request) {
        log.error("Unhandled exception on {} {}", request.getMethod(), request.getRequestURI(), ex);
        return respond(ApiError.of(ErrorCode.INTERNAL_ERROR, request.getRequestURI()));
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  HttpHeaders headers, HttpStatusCode status,
                                                                  WebRequest request) {
        Map<String, String> fields = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                fields.putIfAbsent(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.badRequest().headers(headers)
                .body(ApiError.of(ErrorCode.VALIDATION_FAILED, pathOf(request), fields));
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex,
                                                                  HttpHeaders headers, HttpStatusCode status,
                                                                  WebRequest request) {
        return ResponseEntity.badRequest().headers(headers)
                .body(ApiError.of(ErrorCode.VALIDATION_FAILED, pathOf(request)));
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(Exception ex, Object body, HttpHeaders headers,
                                                             HttpStatusCode statusCode, WebRequest request) {
        if (statusCode.is5xxServerError()) {
            log.error("Framework error on {}", pathOf(request), ex);
            return ResponseEntity.status(statusCode).headers(headers)
                    .body(ApiError.of(ErrorCode.INTERNAL_ERROR, pathOf(request)));
        }
        HttpStatus status = HttpStatus.valueOf(statusCode.value());
        ApiError error = new ApiError(OffsetDateTime.now(), status.value(), status.getReasonPhrase(),
                "HTTP_" + status.value(), messageFor(status), pathOf(request), Map.of());
        return ResponseEntity.status(status).headers(headers).body(error);
    }

    private String messageFor(HttpStatus status) {
        return status == HttpStatus.NOT_FOUND ? "Không tìm thấy tài nguyên." : "Yêu cầu không hợp lệ.";
    }

    private String pathOf(WebRequest request) {
        return ((ServletWebRequest) request).getRequest().getRequestURI();
    }

    private ResponseEntity<ApiError> respond(ApiError error) {
        return ResponseEntity.status(error.status()).body(error);
    }
}
