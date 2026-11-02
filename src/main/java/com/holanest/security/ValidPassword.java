package com.holanest.security;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.nio.charset.StandardCharsets;

import com.holanest.config.ValidationConstants;

import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;

/** BR02: at least 8 characters with both letters and digits; also within BCrypt's 72-byte limit. */
@Documented
@Constraint(validatedBy = ValidPassword.Validator.class)
@Target({ElementType.FIELD, ElementType.RECORD_COMPONENT, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPassword {

    String message() default "Mật khẩu từ 8 ký tự, có cả chữ và số, và không quá dài.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    class Validator implements ConstraintValidator<ValidPassword, String> {
        @Override
        public boolean isValid(String value, ConstraintValidatorContext context) {
            if (value == null || value.isEmpty()) {
                // Reported by @NotBlank
                return true;
            }
            return value.length() >= ValidationConstants.PASSWORD_MIN
                    && value.getBytes(StandardCharsets.UTF_8).length <= ValidationConstants.PASSWORD_MAX_BYTES
                    && value.chars().anyMatch(Character::isLetter)
                    && value.chars().anyMatch(Character::isDigit);
        }
    }
}
