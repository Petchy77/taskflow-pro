package com.taskflow.repository;

import com.taskflow.entity.Task;
import com.taskflow.entity.enums.Priority;
import com.taskflow.entity.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {

    List<Task> findByProjectId(Long projectId);

    List<Task> findByAssigneeId(Long assigneeId);

    List<Task> findByStatus(TaskStatus status);

    List<Task> findByProjectIdAndStatus(Long projectId, TaskStatus status);

    Page<Task> findByCreatorId(Long creatorId, Pageable pageable);
}
