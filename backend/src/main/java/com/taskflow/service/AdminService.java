package com.taskflow.service;

import com.taskflow.dto.admin.AdminStatsResponse;
import com.taskflow.dto.admin.AuditLogResponse;
import com.taskflow.dto.admin.UserAdminResponse;
import com.taskflow.entity.AuditLog;
import com.taskflow.entity.User;
import com.taskflow.entity.enums.Role;
import com.taskflow.entity.enums.TaskStatus;
import com.taskflow.entity.enums.Priority;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.AuditLogRepository;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final AuditLogRepository auditLogRepository;

    @Transactional(readOnly = true)
    public AdminStatsResponse getStats() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.findAll().stream()
                .filter(u -> Boolean.TRUE.equals(u.getEnabled())).count();
        long totalProjects = projectRepository.count();
        long totalTasks = taskRepository.count();

        // Tasks by status
        Map<String, Long> tasksByStatus = new HashMap<>();
        for (TaskStatus status : TaskStatus.values()) {
            long count = taskRepository.findAll().stream()
                    .filter(t -> t.getStatus() == status).count();
            tasksByStatus.put(status.name(), count);
        }

        // Tasks by priority
        Map<String, Long> tasksByPriority = new HashMap<>();
        for (Priority priority : Priority.values()) {
            long count = taskRepository.findAll().stream()
                    .filter(t -> t.getPriority() == priority).count();
            tasksByPriority.put(priority.name(), count);
        }

        // Completed this month
        LocalDateTime startOfMonth = LocalDateTime.now()
                .withDayOfMonth(1).withHour(0).withMinute(0);
        long completedThisMonth = taskRepository.findAll().stream()
                .filter(t -> t.getCompletedAt() != null
                        && t.getCompletedAt().isAfter(startOfMonth))
                .count();

        // Overdue tasks
        long overdueTasks = taskRepository.findAll().stream()
                .filter(t -> t.getDueDate() != null
                        && t.getDueDate().isBefore(LocalDate.now())
                        && t.getStatus() != TaskStatus.DONE)
                .count();

        return AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .totalProjects(totalProjects)
                .totalTasks(totalTasks)
                .tasksByStatus(tasksByStatus)
                .tasksByPriority(tasksByPriority)
                .completedThisMonth(completedThisMonth)
                .overdueTasks(overdueTasks)
                .build();
    }

    @Transactional(readOnly = true)
    public List<UserAdminResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> UserAdminResponse.from(u,
                        taskRepository.findAll().stream()
                                .filter(t -> t.getCreator().getId().equals(u.getId()))
                                .count()))
                .toList();
    }

    @Transactional
    public UserAdminResponse updateUserRole(Long userId, Role newRole, User adminUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Role oldRole = user.getRole();
        user.setRole(newRole);
        userRepository.save(user);

        logAction(adminUser, "ROLE_CHANGED", "USER", userId,
                String.format("Changed %s from %s to %s", user.getUsername(), oldRole, newRole));

        log.info("Admin {} changed role of {} from {} to {}",
                adminUser.getUsername(), user.getUsername(), oldRole, newRole);

        long taskCount = taskRepository.findAll().stream()
                .filter(t -> t.getCreator().getId().equals(userId)).count();
        return UserAdminResponse.from(user, taskCount);
    }

    @Transactional
    public UserAdminResponse toggleUserStatus(Long userId, User adminUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        user.setEnabled(!Boolean.TRUE.equals(user.getEnabled()));
        userRepository.save(user);

        String action = Boolean.TRUE.equals(user.getEnabled()) ? "USER_ENABLED" : "USER_DISABLED";
        logAction(adminUser, action, "USER", userId,
                String.format("%s %s", action.toLowerCase().replace("_", " "), user.getUsername()));

        log.info("Admin {} {} user {}",
                adminUser.getUsername(), action, user.getUsername());

        long taskCount = taskRepository.findAll().stream()
                .filter(t -> t.getCreator().getId().equals(userId)).count();
        return UserAdminResponse.from(user, taskCount);
    }

    @Transactional
    public void deleteUser(Long userId, User adminUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        if (user.getId().equals(adminUser.getId())) {
            throw new IllegalArgumentException("Cannot delete yourself");
        }

        String username = user.getUsername();
        logAction(adminUser, "USER_DELETED", "USER", userId,
                "Deleted user: " + username);

        userRepository.delete(user);
        log.info("Admin {} deleted user {}", adminUser.getUsername(), username);
    }

    @Transactional(readOnly = true)
    public Page<AuditLogResponse> getAuditLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(AuditLogResponse::from);
    }

    private void logAction(User user, String action, String targetType, Long targetId, String details) {
        AuditLog log = AuditLog.builder()
                .user(user)
                .action(action)
                .targetType(targetType)
                .targetId(targetId)
                .details(details)   // ← ตรงๆ ไม่ wrap JSON
                .build();
        auditLogRepository.save(log);
    }
}