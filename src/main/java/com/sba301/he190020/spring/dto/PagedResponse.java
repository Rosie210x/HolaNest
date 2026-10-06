package com.sba301.he190020.spring.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Kết quả phân trang")
public record PagedResponse<T>(
        List<T> content,
        @Schema(example = "0") int page,
        @Schema(example = "10") int size,
        @Schema(example = "25") long totalElements,
        @Schema(example = "3") int totalPages,
        @Schema(example = "true") boolean first,
        @Schema(example = "false") boolean last
) {
}
