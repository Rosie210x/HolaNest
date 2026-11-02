package com.holanest.config;

public final class ValidationConstants {
    public static final int EMAIL_MAX = 255;
    public static final int FULL_NAME_MAX = 100;
    public static final int PASSWORD_MIN = 8;
    // BCrypt only hashes the first 72 bytes
    public static final int PASSWORD_MAX_BYTES = 72;
    // BR02: 10 digits, starting with 0
    public static final String PHONE_PATTERN = "^0\\d{9}$";

    private ValidationConstants() {
    }
}
