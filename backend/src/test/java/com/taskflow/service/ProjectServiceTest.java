package com.taskflow.service;

import com.taskflow.dto.project.CreateProjectRequest;
import com.taskflow.dto.project.ProjectResponse;
import com.taskflow.dto.project.UpdateProjectRequest;
import com.taskflow.entity.Project;
import com.taskflow.entity.User;
import com.taskflow.entity.enums.Role;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.exception.UnauthorizedException;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProjectService Tests")
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private ProjectService projectService;

    private User petch;
    private User admin;
    private Project petchProject;

    @BeforeEach
    void setUp() {
        petch = User.builder()
                .id(2L)
                .username("petch")
                .fullName("Petch")
                .role(Role.USER)
                .build();

        admin = User.builder()
                .id(1L)
                .username("admin")
                .fullName("Admin")
                .role(Role.ADMIN)
                .build();

        petchProject = Project.builder()
                .id(100L)
                .name("My Project")
                .description("Description")
                .owner(petch)
                .build();
    }

    @Test
    @DisplayName("should create project for current user")
    void shouldCreateProject() {
        // Given
        CreateProjectRequest request = new CreateProjectRequest();
        request.setName("New Project");
        request.setDescription("New description");

        when(projectRepository.save(any(Project.class))).thenAnswer(inv -> {
            Project p = inv.getArgument(0);
            p.setId(101L);
            return p;
        });

        // When
        ProjectResponse response = projectService.create(request, petch);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getName()).isEqualTo("New Project");
        assertThat(response.getOwner().getId()).isEqualTo(petch.getId());
        assertThat(response.getTaskCount()).isZero();
    }

    @Test
    @DisplayName("should return all projects for owner")
    void shouldReturnAllProjectsForOwner() {
        // Given
        when(projectRepository.findByOwnerId(petch.getId()))
                .thenReturn(List.of(petchProject));
        when(taskRepository.findByProjectId(100L)).thenReturn(Collections.emptyList());

        // When
        List<ProjectResponse> projects = projectService.findAllByOwner(petch);

        // Then
        assertThat(projects).hasSize(1);
        assertThat(projects.get(0).getName()).isEqualTo("My Project");
    }

    @Test
    @DisplayName("should find project by id when user is owner")
    void shouldFindProjectByIdWhenOwner() {
        // Given
        when(projectRepository.findById(100L)).thenReturn(Optional.of(petchProject));
        when(taskRepository.findByProjectId(100L)).thenReturn(Collections.emptyList());

        // When
        ProjectResponse response = projectService.findById(100L, petch);

        // Then
        assertThat(response.getId()).isEqualTo(100L);
    }

    @Test
    @DisplayName("should throw when project not found")
    void shouldThrowWhenProjectNotFound() {
        // Given
        when(projectRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> projectService.findById(999L, petch))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Project not found");
    }

    @Test
    @DisplayName("should throw when user is not project owner")
    void shouldThrowWhenNotOwner() {
        // Given - admin tries to access petch's project
        when(projectRepository.findById(100L)).thenReturn(Optional.of(petchProject));

        // When & Then
        assertThatThrownBy(() -> projectService.findById(100L, admin))
                .isInstanceOf(UnauthorizedException.class)
                .hasMessageContaining("don't have access");
    }

    @Test
    @DisplayName("should update project name and description")
    void shouldUpdateProject() {
        // Given
        UpdateProjectRequest request = new UpdateProjectRequest();
        request.setName("Updated Name");
        request.setDescription("Updated description");

        when(projectRepository.findById(100L)).thenReturn(Optional.of(petchProject));
        when(projectRepository.save(any(Project.class))).thenAnswer(inv -> inv.getArgument(0));
        when(taskRepository.findByProjectId(100L)).thenReturn(Collections.emptyList());

        // When
        ProjectResponse response = projectService.update(100L, request, petch);

        // Then
        assertThat(response.getName()).isEqualTo("Updated Name");
        assertThat(response.getDescription()).isEqualTo("Updated description");
    }

    @Test
    @DisplayName("should not allow non-owner to delete project")
    void shouldNotAllowNonOwnerToDelete() {
        // Given
        when(projectRepository.findById(100L)).thenReturn(Optional.of(petchProject));

        // When & Then
        assertThatThrownBy(() -> projectService.delete(100L, admin))
                .isInstanceOf(UnauthorizedException.class);

        verify(projectRepository, never()).delete(any());
    }

    @Test
    @DisplayName("should delete project when user is owner")
    void shouldDeleteProjectWhenOwner() {
        // Given
        when(projectRepository.findById(100L)).thenReturn(Optional.of(petchProject));

        // When
        projectService.delete(100L, petch);

        // Then
        verify(projectRepository).delete(petchProject);
    }
}
