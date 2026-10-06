package com.sba301.he190020.spring.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sba301.he190020.spring.dto.SignInRequest;
import com.sba301.he190020.spring.dto.SignInResponse;
import com.sba301.he190020.spring.dto.SignUpRequest;
import com.sba301.he190020.spring.dto.SignUpResponse;
import com.sba301.he190020.spring.exception.ApiError;
import com.sba301.he190020.spring.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication Service", description = "Các API đăng ký và đăng nhập hệ thống để nhận JWT Token")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    @Operation(
            summary = "Đăng ký tài khoản người dùng mới",
            description = "Tạo một user mới với email, password và role."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Đăng ký thành công",
                    content = @Content(schema = @Schema(implementation = SignUpResponse.class))),
            @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "409", description = "Email đã tồn tại",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<SignUpResponse> signup(@Valid @RequestBody SignUpRequest request) {
        SignUpResponse response = authService.signup(request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/signin")
    @Operation(
            summary = "Đăng nhập hệ thống",
            description = "Xác thực người dùng bằng email/password và trả về JWT Bearer Token."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Đăng nhập thành công",
                    content = @Content(schema = @Schema(implementation = SignInResponse.class))),
            @ApiResponse(responseCode = "400", description = "Dữ liệu đăng nhập không hợp lệ",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "401", description = "Email hoặc mật khẩu không chính xác",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<SignInResponse> signin(@Valid @RequestBody SignInRequest request) {
        SignInResponse response = authService.signin(request);
        return ResponseEntity.ok(response);
    }
}
