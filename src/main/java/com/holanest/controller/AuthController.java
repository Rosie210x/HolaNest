package com.holanest.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.holanest.dto.SignInRequest;
import com.holanest.dto.SignUpRequest;
import com.holanest.dto.UserResponse;
import com.holanest.exception.ApiError;
import com.holanest.exception.AppException;
import com.holanest.security.AuthCookies;
import com.holanest.security.UserPrincipal;
import com.holanest.service.AuthService;
import com.holanest.service.AuthSessionService;
import com.holanest.service.AuthSessionService.IssuedTokens;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Đăng ký, đăng nhập và quản lý phiên bằng cookie httpOnly")
public class AuthController {

    private final AuthService authService;
    private final AuthSessionService sessionService;
    private final AuthCookies authCookies;

    @PostMapping("/signup")
    @SecurityRequirements
    @Operation(summary = "Đăng ký tài khoản (UC01)",
            description = "Tạo tài khoản vai trò Người thuê và đăng nhập ngay; token được đặt trong cookie httpOnly.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Đăng ký thành công"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "403", description = "Thiếu hoặc sai CSRF token",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "409", description = "MSG02: email đã được sử dụng",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "429", description = "MSG31: vượt giới hạn tần suất",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<UserResponse> signup(@Valid @RequestBody SignUpRequest request,
                                               HttpServletResponse response) {
        IssuedTokens tokens = authService.signup(request);
        writeCookies(response, tokens);
        return ResponseEntity.status(HttpStatus.CREATED).body(tokens.user());
    }

    @PostMapping("/signin")
    @SecurityRequirements
    @Operation(summary = "Đăng nhập (UC02)",
            description = "Xác thực email và mật khẩu; token được đặt trong cookie httpOnly, không trả trong body.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Đăng nhập thành công"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "401", description = "MSG03: sai email hoặc mật khẩu",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "403", description = "MSG05: tài khoản bị khóa, hoặc thiếu CSRF token",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "423", description = "MSG04: sai 5 lần, tạm khóa 15 phút",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "429", description = "MSG31: vượt giới hạn tần suất",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<UserResponse> signin(@Valid @RequestBody SignInRequest request,
                                               HttpServletResponse response) {
        IssuedTokens tokens = authService.signin(request);
        writeCookies(response, tokens);
        return ResponseEntity.ok(tokens.user());
    }

    @PostMapping("/refresh")
    @SecurityRequirements
    @Operation(summary = "Cấp lại access token",
            description = "Dùng refresh token trong cookie và xoay vòng token. Dùng lại token cũ sẽ hủy cả phiên.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Đã cấp token mới"),
            @ApiResponse(responseCode = "401", description = "MSG28: phiên đã hết hạn",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "403", description = "MSG05: tài khoản bị khóa, hoặc thiếu CSRF token",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<UserResponse> refresh(
            @Parameter(hidden = true) @CookieValue(name = AuthCookies.REFRESH_TOKEN, required = false) String refreshToken,
            HttpServletResponse response) {
        try {
            IssuedTokens tokens = sessionService.refresh(refreshToken);
            writeCookies(response, tokens);
            return ResponseEntity.ok(tokens.user());
        } catch (AppException e) {
            authCookies.clear(response);
            throw e;
        }
    }

    @PostMapping("/signout")
    @SecurityRequirements
    @Operation(summary = "Đăng xuất (UC02)", description = "Hủy phiên hiện tại và xóa cookie.")
    @ApiResponse(responseCode = "204", description = "Đã đăng xuất")
    public ResponseEntity<Void> signout(
            @Parameter(hidden = true) @CookieValue(name = AuthCookies.REFRESH_TOKEN, required = false) String refreshToken,
            HttpServletResponse response) {
        // Signing out always succeeds for the caller: the cookies go away even if the token is already invalid
        authCookies.clear(response);
        if (refreshToken != null) {
            try {
                sessionService.revoke(refreshToken);
            } catch (AppException ignored) {
                // Malformed token: there is no session to end
            }
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    @Operation(summary = "Lấy tài khoản đang đăng nhập",
            description = "Frontend dùng API này để biết người dùng và vai trò, vì không đọc được cookie httpOnly.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Thông tin tài khoản"),
            @ApiResponse(responseCode = "401", description = "Chưa đăng nhập hoặc phiên đã hết hạn",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public UserResponse me(@AuthenticationPrincipal UserPrincipal principal) {
        return authService.currentUser(principal.getId());
    }

    private void writeCookies(HttpServletResponse response, IssuedTokens tokens) {
        authCookies.addAccessToken(response, tokens.accessToken());
        if (tokens.refreshToken() != null) {
            authCookies.addRefreshToken(response, tokens.refreshToken());
        }
    }
}
