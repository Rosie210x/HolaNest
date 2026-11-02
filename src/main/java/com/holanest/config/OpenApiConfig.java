package com.holanest.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.holanest.security.AuthCookies;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class OpenApiConfig {

    public static final String COOKIE_AUTH_SCHEME = "cookieAuth";

    @Bean
    public OpenAPI holaNestOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Hola Nest REST API")
                        .version("1.0.0")
                        .description("""
                                API của nền tảng Hola Nest. Đăng nhập qua POST /api/v1/auth/signin: token được \
                                lưu trong cookie httpOnly nên Swagger UI tự gửi kèm, không cần nhập vào Authorize. \
                                Yêu cầu POST/PUT/PATCH/DELETE cần header X-XSRF-TOKEN; Swagger UI tự thêm từ cookie XSRF-TOKEN."""))
                .addSecurityItem(new SecurityRequirement().addList(COOKIE_AUTH_SCHEME))
                .components(new Components()
                        .addSecuritySchemes(COOKIE_AUTH_SCHEME,
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.APIKEY)
                                        .in(SecurityScheme.In.COOKIE)
                                        .name(AuthCookies.ACCESS_TOKEN)
                                        .description("JWT access token (15 phút) trong cookie httpOnly.")));
    }
}
