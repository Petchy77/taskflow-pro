package com.taskflow.controller;

import com.taskflow.dto.admin.AdminStatsResponse;
import com.taskflow.dto.admin.AuditLogResponse;
import com.taskflow.dto.admin.UserAdminResponse;
import com.taskflow.entity.User;
import com.taskflow.entity.enums.Role;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.taskflow.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserAdminResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<UserAdminResponse> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User adminUser) {
        Role newRole = Role.valueOf(body.get("role"));
        return ResponseEntity.ok(adminService.updateUserRole(id, newRole, adminUser));
    }

    @PatchMapping("/users/{id}/toggle")
    public ResponseEntity<UserAdminResponse> toggleUserStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal User adminUser) {
        return ResponseEntity.ok(adminService.toggleUserStatus(id, adminUser));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id,
            @AuthenticationPrincipal User adminUser) {
        adminService.deleteUser(id, adminUser);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<Page<AuditLogResponse>> getAuditLogs(Pageable pageable) {
        return ResponseEntity.ok(adminService.getAuditLogs(pageable));
    }
}