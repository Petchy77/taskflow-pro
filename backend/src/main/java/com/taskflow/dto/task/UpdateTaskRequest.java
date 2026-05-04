package com.taskflow.dto.task;

import com.taskflow.entity.enums.Priority;
import com.taskflow.entity.enums.TaskStatus;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateTaskRequest {

    @Size(min = 1, max = 200)
    private String title;

    @Size(max = 2000)
    private String description;

    private TaskStatus status;

    private Priority priority;

    private Long assigneeId;

    private LocalDate dueDate;
}
