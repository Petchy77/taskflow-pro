package com.taskflow.service;

import com.taskflow.dto.project.CreateProjectRequest;
import com.taskflow.dto.project.ProjectResponse;
import com.taskflow.dto.project.UpdateProjectRequest;
import com.taskflow.entity.Project;
import com.taskflow.entity.User;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.exception.UnauthorizedException;
import com.taskflow.mapper.ProjectMapper;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    @Transactional
    public ProjectResponse create(CreateProjectRequest request, User currentUser) {
        log.info("Creating project '{}' for user {}", request.getName(), currentUser.getUsername());

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(currentUser)
                .build();

        Project saved = projectRepository.save(project);
        return ProjectMapper.toResponse(saved, 0L);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> findAllByOwner(User currentUser) {
        return projectRepository.findByOwnerId(currentUser.getId()).stream()
                .map(p -> ProjectMapper.toResponse(p, taskRepository.findByProjectId(p.getId()).size()))
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectResponse findById(Long id, User currentUser) {
        Project project = getProjectAndCheckOwnership(id, currentUser);
        long taskCount = taskRepository.findByProjectId(id).size();
        return ProjectMapper.toResponse(project, taskCount);
    }

    @Transactional
    public ProjectResponse update(Long id, UpdateProjectRequest request, User currentUser) {
        Project project = getProjectAndCheckOwnership(id, currentUser);

        if (request.getName() != null) {
            project.setName(request.getName());
        }
        if (request.getDescription() != null) {
            project.setDescription(request.getDescription());
        }

        Project saved = projectRepository.save(project);
        long taskCount = taskRepository.findByProjectId(id).size();
        return ProjectMapper.toResponse(saved, taskCount);
    }

    @Transactional
    public void delete(Long id, User currentUser) {
        Project project = getProjectAndCheckOwnership(id, currentUser);
        projectRepository.delete(project);
        log.info("Deleted project id={}", id);
    }

    /**
     * Helper: ดึง project + ตรวจสอบว่าเป็นเจ้าของจริง
     */
    private Project getProjectAndCheckOwnership(Long id, User currentUser) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: id=" + id));

        if (!project.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You don't have access to this project");
        }
        return project;
    }
}
