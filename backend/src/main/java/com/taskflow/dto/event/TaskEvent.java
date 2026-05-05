package com.taskflow.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskEvent {
    private String type;          // CREATED, UPDATED, STATUS_CHANGED, DELETED
    private Long taskId;
    private String taskTitle;
    private String oldStatus;
    private String newStatus;
    private String username;      // who made the change
    private LocalDateTime timestamp;
}