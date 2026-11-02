package com.holanest.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.holanest.dto.MessageResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Access check", description = "Kiểm tra phân quyền RBAC theo vai trò")
public class AccessCheckController {

    @GetMapping("/renter/access-check")
    @PreAuthorize("hasRole('RENTER')")
    @Operation(summary = "Chỉ Người thuê")
    public MessageResponse renter() {
        return new MessageResponse("Bạn có quyền Người thuê.");
    }

    @GetMapping("/landlord/access-check")
    @PreAuthorize("hasRole('LANDLORD')")
    @Operation(summary = "Chỉ Chủ trọ")
    public MessageResponse landlord() {
        return new MessageResponse("Bạn có quyền Chủ trọ.");
    }

    @GetMapping("/admin/access-check")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Chỉ Admin")
    public MessageResponse admin() {
        return new MessageResponse("Bạn có quyền Admin.");
    }
}
