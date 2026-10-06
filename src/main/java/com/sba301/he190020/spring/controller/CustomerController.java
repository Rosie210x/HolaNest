package com.sba301.he190020.spring.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sba301.he190020.spring.config.OpenApiConfig;
import com.sba301.he190020.spring.dto.CustomerCreateRequest;
import com.sba301.he190020.spring.dto.CustomerResponse;
import com.sba301.he190020.spring.dto.CustomerUpdateRequest;
import com.sba301.he190020.spring.dto.PagedResponse;
import com.sba301.he190020.spring.exception.ApiError;
import com.sba301.he190020.spring.service.CustomerService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/customers")
@Tag(name = "Customer Management", description = "Các API quản lý thông tin khách hàng")
@SecurityRequirement(name = OpenApiConfig.BEARER_KEY_SECURITY_SCHEME)
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    @Operation(summary = "Lấy tất cả danh sách khách hàng (List all)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = CustomerResponse.class)))),
            @ApiResponse(responseCode = "401", description = "Chưa xác thực JWT",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<List<CustomerResponse>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAll());
    }

    @GetMapping(params = {"page", "size"})
    @Operation(summary = "Lấy danh sách khách hàng có phân trang và lọc (List with parameters)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lấy danh sách phân trang thành công",
                    content = @Content(schema = @Schema(implementation = PagedResponse.class))),
            @ApiResponse(responseCode = "401", description = "Chưa xác thực JWT",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<Page<CustomerResponse>> getPagedCustomers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String email,
        @RequestParam(required = false) String name
) {
    Page<CustomerResponse> result = customerService.getPaged(page, size, email, name);
    return ResponseEntity.ok(result);
}

    @GetMapping("/{customerId}")
    @Operation(summary = "Lấy thông tin chi tiết khách hàng theo ID (Get detail)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lấy thông tin thành công",
                    content = @Content(schema = @Schema(implementation = CustomerResponse.class))),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy khách hàng",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<CustomerResponse> getCustomerById(@PathVariable Long customerId) {
        return ResponseEntity.ok(customerService.get(customerId));
    }

    @PostMapping
    @Operation(summary = "Tạo mới một khách hàng (Create customer)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tạo thành công",
                    content = @Content(schema = @Schema(implementation = CustomerResponse.class))),
            @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "409", description = "Email khách hàng đã tồn tại",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<CustomerResponse> createCustomer(@Valid @RequestBody CustomerCreateRequest request) {
        return ResponseEntity.ok(customerService.create(request));
    }

    @PutMapping("/{customerId}")
    @Operation(summary = "Cập nhật thông tin khách hàng theo ID (Update customer)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cập nhật thành công",
                    content = @Content(schema = @Schema(implementation = CustomerResponse.class))),
            @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ",
                    content = @Content(schema = @Schema(implementation = ApiError.class))),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy khách hàng",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<CustomerResponse> updateCustomer(
            @PathVariable Long customerId,
            @Valid @RequestBody CustomerUpdateRequest request) {
        return ResponseEntity.ok(customerService.update(customerId, request));
    }

    @DeleteMapping("/{customerId}")
    @Operation(summary = "Xóa khách hàng theo ID (Delete a customer)")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Xóa thành công (No Content)"),
            @ApiResponse(responseCode = "404", description = "Không tìm thấy khách hàng",
                    content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long customerId) {
        customerService.delete(customerId);
        return ResponseEntity.noContent().build();
    }
}