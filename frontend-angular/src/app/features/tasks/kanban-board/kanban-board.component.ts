import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { LucideAngularModule, Plus } from 'lucide-angular';

import { ApiService } from '../../../core/services/api.service';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { TaskModalComponent } from '../../../shared/components/task-modal/task-modal.component';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, LucideAngularModule, TaskModalComponent],
  templateUrl: './kanban-board.component.html'
})
export class KanbanBoardComponent implements OnInit {
  private apiService = inject(ApiService);

  protected PlusIcon = Plus;

  allTasks = signal<Task[]>([]);
  isLoading = signal(true);
  isModalOpen = signal(false);

  // Stable computed signals - one per column
  todoTasks = computed(() => this.allTasks().filter(t => t.status === 'TODO'));
  inProgressTasks = computed(() => this.allTasks().filter(t => t.status === 'IN_PROGRESS'));
  reviewTasks = computed(() => this.allTasks().filter(t => t.status === 'REVIEW'));
  doneTasks = computed(() => this.allTasks().filter(t => t.status === 'DONE'));

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading.set(true);
    this.apiService.getTasks({ size: 100 }).subscribe({
      next: (response) => {
        this.allTasks.set(response.content);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onDrop(event: CdkDragDrop<Task[]>, targetStatus: TaskStatus): void {
    if (event.previousContainer === event.container) {
      return;
    }

    const draggedTask = event.previousContainer.data[event.previousIndex];

    // Only update if status actually changed
    if (draggedTask.status === targetStatus) {
      return;
    }

    // Optimistic update
    this.allTasks.update(tasks =>
      tasks.map(t =>
        t.id === draggedTask.id
          ? { ...t, status: targetStatus }
          : t
      )
    );

    // Sync to backend
    this.apiService.updateTaskStatus(draggedTask.id, targetStatus).subscribe({
      error: () => {
        console.error('Failed to update status');
        this.loadTasks();
      }
    });
  }

  openCreateModal(): void {
    this.isModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.isModalOpen.set(false);
  }

  onTaskCreated(): void {
    this.loadTasks();
  }

  priorityBadgeClass(priority: string): string {
    const map: Record<string, string> = {
      LOW: 'bg-gray-100 text-gray-700',
      MEDIUM: 'bg-blue-100 text-blue-700',
      HIGH: 'bg-orange-100 text-orange-700',
      URGENT: 'bg-red-100 text-red-700'
    };
    return map[priority] ?? 'bg-gray-100 text-gray-700';
  }
}