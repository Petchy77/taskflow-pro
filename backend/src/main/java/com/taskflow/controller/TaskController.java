package com.taskflow.controller;

import com.taskflow.dto.task.CreateTaskRequest;
import com.taskflow.dto.task.TaskResponse;
import com.taskflow.dto.task.UpdateTaskRequest;
import com.taskflow.dto.task.UpdateTaskStatusRequest;
import com.taskflow.entity.User;
import com.taskflow.entity.enums.Priority;
import com.taskflow.entity.enums.TaskStatus;
import com.taskflow.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponse> create(
            @Valid @RequestBody CreateTaskRequest request,
            @AuthenticationPrincipal User user) {
        TaskResponse response = taskService.create(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<TaskResponse>> getAll(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) Long assigneeId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(
                taskService.findAll(user, status, priority, projectId, assigneeId, pageable)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(taskService.findById(id, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTaskRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(taskService.update(id, request, user));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTaskStatusRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(taskService.updateStatus(id, request.getStatus(), user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        taskService.delete(id, user);
        return ResponseEntity.noContent().build();
    }
}
