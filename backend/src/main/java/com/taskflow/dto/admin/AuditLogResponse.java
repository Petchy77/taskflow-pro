package com.taskflow.dto.admin;

import com.taskflow.entity.AuditLog;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AuditLogResponse {
    private Long id;
    private String username;
    private String action;
    private String targetType;
    private Long targetId;
    private String details;
    private LocalDateTime createdAt;

    public static AuditLogResponse from(AuditLog log) {
        String detailsText = log.getDetails();
        if (detailsText != null && detailsText.startsWith("{\"message\":")) {
            detailsText = detailsText.substring(12, detailsText.length() - 2)
                    .replace("\\\"", "\"");
        }
        
        return AuditLogResponse.builder()
                .id(log.getId())
                .username(log.getUser() != null ? log.getUser().getUsername() : null)
                .action(log.getAction())
                .targetType(log.getTargetType())
                .targetId(log.getTargetId())
                .details(detailsText)
                .createdAt(log.getCreatedAt())
                .build();
    }
}