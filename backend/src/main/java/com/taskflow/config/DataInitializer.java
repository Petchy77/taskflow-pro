package com.taskflow.config;

import com.taskflow.entity.Project;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.entity.enums.Priority;
import com.taskflow.entity.enums.Role;
import com.taskflow.entity.enums.TaskStatus;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Sample data already exists, skipping initialization");
            return;
        }

        log.info("Initializing sample data...");

        User admin = userRepository.save(User.builder()
                .username("admin")
                .email("admin@taskflow.com")
                .password(passwordEncoder.encode("admin123"))
                .fullName("System Admin")
                .role(Role.ADMIN)
                .enabled(true)
                .build());

        User petch = userRepository.save(User.builder()
                .username("petch")
                .email("petch@taskflow.com")
                .password(passwordEncoder.encode("petch123"))
                .fullName("Petch (Natawat)")
                .role(Role.USER)
                .enabled(true)
                .build());

        Project project = projectRepository.save(Project.builder()
                .name("TaskFlow Pro Development")
                .description("Build production-ready task management system")
                .owner(petch)
                .build());

        taskRepository.save(Task.builder()
                .title("Setup Spring Boot backend")
                .description("Initialize project with required dependencies")
                .status(TaskStatus.DONE)
                .priority(Priority.HIGH)
                .project(project)
                .creator(petch)
                .assignee(petch)
                .dueDate(LocalDate.now().minusDays(1))
                .build());

        taskRepository.save(Task.builder()
                .title("Implement JWT authentication")
                .description("Add login/register with JWT tokens")
                .status(TaskStatus.IN_PROGRESS)
                .priority(Priority.URGENT)
                .project(project)
                .creator(petch)
                .assignee(petch)
                .dueDate(LocalDate.now().plusDays(3))
                .build());

        taskRepository.save(Task.builder()
                .title("Build Angular frontend")
                .description("Create login page and dashboard")
                .status(TaskStatus.TODO)
                .priority(Priority.MEDIUM)
                .project(project)
                .creator(petch)
                .assignee(petch)
                .dueDate(LocalDate.now().plusDays(7))
                .build());

        log.info("Sample data initialized!");
        log.info("Login credentials:");
        log.info("   admin / admin123  (ADMIN)");
        log.info("   petch / petch123  (USER)");
    }
}
