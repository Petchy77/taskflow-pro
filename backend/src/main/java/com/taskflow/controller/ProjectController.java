package com.taskflow.controller;

import com.taskflow.dto.project.CreateProjectRequest;
import com.taskflow.dto.project.ProjectResponse;
import com.taskflow.dto.project.UpdateProjectRequest;
import com.taskflow.entity.User;
import com.taskflow.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<ProjectResponse> create(
            @Valid @RequestBody CreateProjectRequest request,
            @AuthenticationPrincipal User user) {
        ProjectResponse response = projectService.create(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(projectService.findAllByOwner(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(projectService.findById(id, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProjectRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(projectService.update(id, request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        projectService.delete(id, user);
        return ResponseEntity.noContent().build();
    }
}
