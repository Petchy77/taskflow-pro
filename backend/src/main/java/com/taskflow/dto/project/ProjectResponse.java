package com.taskflow.dto.project;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private OwnerSummary owner;
    private Long taskCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    public static class OwnerSummary {
        private Long id;
        private String username;
        private String fullName;
    }
}
