package com.taskflow.dto.admin;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class AdminStatsResponse {
    private long totalUsers;
    private long activeUsers;
    private long totalProjects;
    private long totalTasks;
    private Map<String, Long> tasksByStatus;
    private Map<String, Long> tasksByPriority;
    private long completedThisMonth;
    private long overdueTasks;
}