package com.taskflow.dto.admin;

import com.taskflow.entity.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserAdminResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private boolean enabled;
    private long taskCount;
    private LocalDateTime createdAt;

    public static UserAdminResponse from(User user, long taskCount) {
        return UserAdminResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .enabled(Boolean.TRUE.equals(user.getEnabled()))
                .taskCount(taskCount)
                .createdAt(user.getCreatedAt())
                .build();
    }
}