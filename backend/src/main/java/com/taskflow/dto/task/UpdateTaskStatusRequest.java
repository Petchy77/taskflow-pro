package com.taskflow.dto.task;

import com.taskflow.entity.enums.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateTaskStatusRequest {

    @NotNull(message = "Status is required")
    private TaskStatus status;
}
