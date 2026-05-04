package com.taskflow.dto.task;

import com.taskflow.entity.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateTaskRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 1, max = 200)
    private String title;

    @Size(max = 2000)
    private String description;

    @NotNull(message = "Project ID is required")
    private Long projectId;

    private Long assigneeId;

    private Priority priority;

    private LocalDate dueDate;
}
