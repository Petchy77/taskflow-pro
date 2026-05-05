package com.taskflow.service;

import com.taskflow.dto.task.CreateTaskRequest;
import com.taskflow.dto.task.TaskResponse;
import com.taskflow.dto.task.UpdateTaskRequest;
import com.taskflow.entity.Project;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.entity.enums.Priority;
import com.taskflow.entity.enums.TaskStatus;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.exception.UnauthorizedException;
import com.taskflow.mapper.TaskMapper;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    @Transactional
    public TaskResponse create(CreateTaskRequest request, User currentUser) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: id=" + request.getProjectId()));

        if (!project.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You don't have access to this project");
        }

        User assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found: id=" + request.getAssigneeId()));
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(TaskStatus.TODO)
                .priority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM)
                .project(project)
                .creator(currentUser)
                .assignee(assignee)
                .dueDate(request.getDueDate())
                .build();

        Task saved = taskRepository.save(task);
        log.info("Created task id={} for project={}", saved.getId(), project.getName());
        return TaskMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<TaskResponse> findAll(User currentUser, TaskStatus status, Priority priority,
                                       Long projectId, Long assigneeId, Pageable pageable) {
        Specification<Task> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Authorization: เห็นแค่ tasks ที่เป็น creator หรือ assignee
            predicates.add(cb.or(
                    cb.equal(root.get("creator").get("id"), currentUser.getId()),
                    cb.equal(root.get("assignee").get("id"), currentUser.getId())
            ));

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (priority != null) {
                predicates.add(cb.equal(root.get("priority"), priority));
            }
            if (projectId != null) {
                predicates.add(cb.equal(root.get("project").get("id"), projectId));
            }
            if (assigneeId != null) {
                predicates.add(cb.equal(root.get("assignee").get("id"), assigneeId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return taskRepository.findAll(spec, pageable).map(TaskMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public TaskResponse findById(Long id, User currentUser) {
        Task task = getTaskAndCheckAccess(id, currentUser);
        return TaskMapper.toResponse(task);
    }

    @Transactional
    public TaskResponse update(Long id, UpdateTaskRequest request, User currentUser) {
        Task task = getTaskAndCheckAccess(id, currentUser);

        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());

        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
            if (request.getStatus() == TaskStatus.DONE && task.getCompletedAt() == null) {
                task.setCompletedAt(LocalDateTime.now());
            } else if (request.getStatus() != TaskStatus.DONE) {
                task.setCompletedAt(null);
            }
        }

        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
            task.setAssignee(assignee);
        }

        Task saved = taskRepository.save(task);
        return TaskMapper.toResponse(saved);
    }

    @Transactional
    public TaskResponse updateStatus(Long id, TaskStatus newStatus, User currentUser) {
        Task task = getTaskAndCheckAccess(id, currentUser);
        TaskStatus oldStatus = task.getStatus();

        task.setStatus(newStatus);
        if (newStatus == TaskStatus.DONE && task.getCompletedAt() == null) {
            task.setCompletedAt(LocalDateTime.now());
        } else if (newStatus != TaskStatus.DONE) {
            task.setCompletedAt(null);
        }
        Task saved = taskRepository.save(task);
        log.info("Updated task id={} status to {}", id, newStatus);

        // Broadcast WebSocket event
        com.taskflow.dto.event.TaskEvent event = com.taskflow.dto.event.TaskEvent.builder()
                .type("STATUS_CHANGED")
                .taskId(saved.getId())
                .taskTitle(saved.getTitle())
                .oldStatus(oldStatus.name())
                .newStatus(newStatus.name())
                .username(currentUser.getUsername())
                .timestamp(LocalDateTime.now())
                .build();
        messagingTemplate.convertAndSend("/topic/tasks", event);

        return TaskMapper.toResponse(saved);
    }

    @Transactional
    public void delete(Long id, User currentUser) {
        Task task = getTaskAndCheckAccess(id, currentUser);

        // Only creator can delete
        if (!task.getCreator().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("Only task creator can delete it");
        }

        taskRepository.delete(task);
        log.info("Deleted task id={}", id);
    }

    private Task getTaskAndCheckAccess(Long id, User currentUser) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: id=" + id));

        boolean isCreator = task.getCreator().getId().equals(currentUser.getId());
        boolean isAssignee = task.getAssignee() != null
                && task.getAssignee().getId().equals(currentUser.getId());

        if (!isCreator && !isAssignee) {
            throw new UnauthorizedException("You don't have access to this task");
        }
        return task;
    }
}
