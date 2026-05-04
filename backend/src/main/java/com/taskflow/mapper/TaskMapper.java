package com.taskflow.mapper;

import com.taskflow.dto.task.TaskResponse;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;

public class TaskMapper {

    public static TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .project(TaskResponse.ProjectSummary.builder()
                        .id(task.getProject().getId())
                        .name(task.getProject().getName())
                        .build())
                .creator(toUserSummary(task.getCreator()))
                .assignee(task.getAssignee() != null ? toUserSummary(task.getAssignee()) : null)
                .dueDate(task.getDueDate())
                .completedAt(task.getCompletedAt())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }

    private static TaskResponse.UserSummary toUserSummary(User user) {
        return TaskResponse.UserSummary.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .build();
    }
}
