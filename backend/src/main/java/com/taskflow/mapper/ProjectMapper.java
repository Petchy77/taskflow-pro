package com.taskflow.mapper;

import com.taskflow.dto.project.ProjectResponse;
import com.taskflow.entity.Project;

public class ProjectMapper {

    public static ProjectResponse toResponse(Project project, long taskCount) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .owner(ProjectResponse.OwnerSummary.builder()
                        .id(project.getOwner().getId())
                        .username(project.getOwner().getUsername())
                        .fullName(project.getOwner().getFullName())
                        .build())
                .taskCount(taskCount)
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }

    public static ProjectResponse toResponse(Project project) {
        return toResponse(project, 0L);
    }
}
