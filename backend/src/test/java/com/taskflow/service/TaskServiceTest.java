package com.taskflow.service;

import com.taskflow.dto.task.CreateTaskRequest;
import com.taskflow.dto.task.TaskResponse;
import com.taskflow.dto.task.UpdateTaskRequest;
import com.taskflow.entity.Project;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.entity.enums.Priority;
import com.taskflow.entity.enums.Role;
import com.taskflow.entity.enums.TaskStatus;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.exception.UnauthorizedException;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("TaskService Tests")
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private TaskService taskService;

    private User petch;
    private User other;
    private Project petchProject;
    private Task petchTask;

    @BeforeEach
    void setUp() {
        petch = User.builder().id(1L).username("petch").fullName("Petch").role(Role.USER).build();
        other = User.builder().id(2L).username("other").fullName("Other").role(Role.USER).build();

        petchProject = Project.builder().id(10L).name("Project").owner(petch).build();

        petchTask = Task.builder()
                .id(100L)
                .title("Test Task")
                .description("desc")
                .status(TaskStatus.TODO)
                .priority(Priority.MEDIUM)
                .project(petchProject)
                .creator(petch)
                .assignee(petch)
                .build();
    }

    @Nested
    @DisplayName("Create task")
    class CreateTaskTests {

        @Test
        @DisplayName("should create task with default values")
        void shouldCreateTask() {
            CreateTaskRequest request = new CreateTaskRequest();
            request.setTitle("New Task");
            request.setProjectId(10L);

            when(projectRepository.findById(10L)).thenReturn(Optional.of(petchProject));
            when(taskRepository.save(any(Task.class))).thenAnswer(inv -> {
                Task t = inv.getArgument(0);
                t.setId(101L);
                return t;
            });

            TaskResponse response = taskService.create(request, petch);

            assertThat(response.getStatus()).isEqualTo(TaskStatus.TODO);
            assertThat(response.getPriority()).isEqualTo(Priority.MEDIUM);
            assertThat(response.getCreator().getId()).isEqualTo(petch.getId());
        }

        @Test
        @DisplayName("should throw when project not found")
        void shouldThrowWhenProjectNotFound() {
            CreateTaskRequest request = new CreateTaskRequest();
            request.setTitle("Task");
            request.setProjectId(999L);

            when(projectRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> taskService.create(request, petch))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Project not found");
        }

        @Test
        @DisplayName("should throw when user is not project owner")
        void shouldThrowWhenNotProjectOwner() {
            CreateTaskRequest request = new CreateTaskRequest();
            request.setTitle("Task");
            request.setProjectId(10L);

            when(projectRepository.findById(10L)).thenReturn(Optional.of(petchProject));

            assertThatThrownBy(() -> taskService.create(request, other))
                    .isInstanceOf(UnauthorizedException.class);
        }

        @Test
        @DisplayName("should set assignee when provided")
        void shouldSetAssignee() {
            CreateTaskRequest request = new CreateTaskRequest();
            request.setTitle("Task");
            request.setProjectId(10L);
            request.setAssigneeId(2L);
            request.setPriority(Priority.HIGH);
            request.setDueDate(LocalDate.now().plusDays(7));

            when(projectRepository.findById(10L)).thenReturn(Optional.of(petchProject));
            when(userRepository.findById(2L)).thenReturn(Optional.of(other));
            when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

            TaskResponse response = taskService.create(request, petch);

            assertThat(response.getAssignee()).isNotNull();
            assertThat(response.getAssignee().getId()).isEqualTo(2L);
            assertThat(response.getPriority()).isEqualTo(Priority.HIGH);
        }
    }

    @Nested
    @DisplayName("Update task status")
    class UpdateStatusTests {

        @Test
        @DisplayName("should set completedAt when marking DONE")
        void shouldSetCompletedAtWhenDone() {
            when(taskRepository.findById(100L)).thenReturn(Optional.of(petchTask));
            when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

            TaskResponse response = taskService.updateStatus(100L, TaskStatus.DONE, petch);

            assertThat(response.getStatus()).isEqualTo(TaskStatus.DONE);
            assertThat(response.getCompletedAt()).isNotNull();
        }

        @Test
        @DisplayName("should clear completedAt when reverting from DONE")
        void shouldClearCompletedAtWhenReverting() {
            petchTask.setStatus(TaskStatus.DONE);
            petchTask.setCompletedAt(java.time.LocalDateTime.now());

            when(taskRepository.findById(100L)).thenReturn(Optional.of(petchTask));
            when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

            TaskResponse response = taskService.updateStatus(100L, TaskStatus.IN_PROGRESS, petch);

            assertThat(response.getStatus()).isEqualTo(TaskStatus.IN_PROGRESS);
            assertThat(response.getCompletedAt()).isNull();
        }

        @Test
        @DisplayName("should throw when user has no access")
        void shouldThrowWhenNoAccess() {
            when(taskRepository.findById(100L)).thenReturn(Optional.of(petchTask));

            assertThatThrownBy(() -> taskService.updateStatus(100L, TaskStatus.DONE, other))
                    .isInstanceOf(UnauthorizedException.class);
        }
    }

    @Nested
    @DisplayName("Delete task")
    class DeleteTaskTests {

        @Test
        @DisplayName("should allow creator to delete")
        void shouldAllowCreatorToDelete() {
            when(taskRepository.findById(100L)).thenReturn(Optional.of(petchTask));

            taskService.delete(100L, petch);

            verify(taskRepository).delete(petchTask);
        }

        @Test
        @DisplayName("should not allow assignee (non-creator) to delete")
        void shouldNotAllowAssigneeToDelete() {
            // petchTask has creator=petch, assignee=petch
            // Make 'other' the assignee
            petchTask.setAssignee(other);

            when(taskRepository.findById(100L)).thenReturn(Optional.of(petchTask));

            assertThatThrownBy(() -> taskService.delete(100L, other))
                    .isInstanceOf(UnauthorizedException.class)
                    .hasMessageContaining("Only task creator");

            verify(taskRepository, never()).delete(any(com.taskflow.entity.Task.class));
        }
    }

    @Nested
    @DisplayName("Update task")
    class UpdateTaskTests {

        @Test
        @DisplayName("should update only provided fields")
        void shouldUpdatePartial() {
            UpdateTaskRequest request = new UpdateTaskRequest();
            request.setTitle("Updated Title");
            request.setPriority(Priority.URGENT);

            when(taskRepository.findById(100L)).thenReturn(Optional.of(petchTask));
            when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

            TaskResponse response = taskService.update(100L, request, petch);

            assertThat(response.getTitle()).isEqualTo("Updated Title");
            assertThat(response.getPriority()).isEqualTo(Priority.URGENT);
            // Original status retained
            assertThat(response.getStatus()).isEqualTo(TaskStatus.TODO);
        }
    }

    @Nested
    @DisplayName("Find task")
    class FindTaskTests {

        @Test
        @DisplayName("should find task by id when user is creator")
        void shouldFindAsCreator() {
            when(taskRepository.findById(100L)).thenReturn(Optional.of(petchTask));

            TaskResponse response = taskService.findById(100L, petch);

            assertThat(response.getId()).isEqualTo(100L);
        }

        @Test
        @DisplayName("should find task when user is assignee (even if not creator)")
        void shouldFindAsAssignee() {
            petchTask.setCreator(other);
            petchTask.setAssignee(petch);

            when(taskRepository.findById(100L)).thenReturn(Optional.of(petchTask));

            TaskResponse response = taskService.findById(100L, petch);

            assertThat(response.getId()).isEqualTo(100L);
        }

        @Test
        @DisplayName("should throw when task not found")
        void shouldThrowWhenNotFound() {
            when(taskRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> taskService.findById(999L, petch))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }
}
