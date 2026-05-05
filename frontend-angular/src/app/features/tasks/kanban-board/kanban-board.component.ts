import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { LucideAngularModule, Plus } from 'lucide-angular';

import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { WebSocketService } from '../../../core/services/websocket.service';
import { Subscription } from 'rxjs';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { TaskModalComponent } from '../../../shared/components/task-modal/task-modal.component';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, LucideAngularModule, TaskModalComponent],
  templateUrl: './kanban-board.component.html'
})
export class KanbanBoardComponent implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private toastService = inject(ToastService);
  private wsService = inject(WebSocketService);
  private wsSubscription?: Subscription;

  protected PlusIcon = Plus;

  allTasks = signal<Task[]>([]);
  isLoading = signal(true);
  isModalOpen = signal(false);

  todoTasks = computed(() => this.allTasks().filter(t => t.status === 'TODO'));
  inProgressTasks = computed(() => this.allTasks().filter(t => t.status === 'IN_PROGRESS'));
  reviewTasks = computed(() => this.allTasks().filter(t => t.status === 'REVIEW'));
  doneTasks = computed(() => this.allTasks().filter(t => t.status === 'DONE'));

  ngOnInit(): void {
    this.loadTasks();
    this.connectWebSocket();
  }

  ngOnDestroy(): void {
    this.wsSubscription?.unsubscribe();
  }

  private connectWebSocket(): void {
    this.wsService.connect();

    this.wsSubscription = this.wsService.taskEvents$.subscribe(event => {
      // Update task status in local state
      this.allTasks.update(tasks =>
        tasks.map(t =>
          t.id === event.taskId
            ? { ...t, status: event.newStatus as any }
            : t
        )
      );

      // Show notification
      this.toastService.info(
        `${event.username} moved "${event.taskTitle}" to ${event.newStatus.replace('_', ' ')}`
      );
    });
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
      next: () => {
        this.toastService.success(`Moved to ${targetStatus.replace('_', ' ')}`);
      },
      error: () => {
        this.toastService.error('Failed to update task status');
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