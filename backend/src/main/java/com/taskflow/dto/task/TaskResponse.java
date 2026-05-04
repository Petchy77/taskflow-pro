package com.taskflow.dto.task;

import com.taskflow.entity.enums.Priority;
import com.taskflow.entity.enums.TaskStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private Priority priority;
    private ProjectSummary project;
    private UserSummary creator;
    private UserSummary assignee;
    private LocalDate dueDate;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    public static class ProjectSummary {
        private Long id;
        private String name;
    }

    @Data
    @Builder
    public static class UserSummary {
        private Long id;
        private String username;
        private String fullName;
    }
}
