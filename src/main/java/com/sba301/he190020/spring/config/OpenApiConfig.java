package com.sba301.he190020.spring.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class OpenApiConfig {

    public static final String BEARER_KEY_SECURITY_SCHEME = "bearerAuth";

    @Bean
    public OpenAPI lab03OpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("SBA301_HE190020_Lab03 - Customer REST API")
                        .version("1.0.0")
                        .description("RESTful Web Service quản lý Customer và Authentication bằng JWT Token.")
                        .license(new License().name("Educational use")))
                .addSecurityItem(new SecurityRequirement().addList(BEARER_KEY_SECURITY_SCHEME))
                .components(new Components()
                        .addSecuritySchemes(BEARER_KEY_SECURITY_SCHEME,
                                new SecurityScheme()
                                        .name(BEARER_KEY_SECURITY_SCHEME)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Nhập JWT Token nhận được từ API POST /api/v1/auth/signin vào đây.")));
    }
}
