import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  DragDropModule,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { LucideAngularModule, Plus } from 'lucide-angular';

import { ApiService } from '../../../core/services/api.service';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { TaskModalComponent } from '../../../shared/components/task-modal/task-modal.component';

interface KanbanColumn {
  id: TaskStatus;
  title: string;
  color: string;
  bgColor: string;
}

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, LucideAngularModule, TaskModalComponent],
  templateUrl: './kanban-board.component.html'
})
export class KanbanBoardComponent implements OnInit {
  private apiService = inject(ApiService);

  protected PlusIcon = Plus;

  columns: KanbanColumn[] = [
    { id: 'TODO',         title: 'To Do',       color: 'text-gray-700',   bgColor: 'bg-gray-100' },
    { id: 'IN_PROGRESS',  title: 'In Progress', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
    { id: 'REVIEW',       title: 'Review',      color: 'text-purple-700', bgColor: 'bg-purple-100' },
    { id: 'DONE',         title: 'Done',        color: 'text-green-700',  bgColor: 'bg-green-100' }
  ];

  allTasks = signal<Task[]>([]);
  isLoading = signal(true);
  isModalOpen = signal(false);

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

    const task = event.previousContainer.data[event.previousIndex];

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    this.allTasks.update(tasks =>
      tasks.map(t => t.id === task.id ? { ...t, status: targetStatus } : t)
    );

    this.apiService.updateTaskStatus(task.id, targetStatus).subscribe({
      error: () => {
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

  getColumnTasks(status: TaskStatus): Task[] {
    if (status === 'TODO') return this.todoTasks();
    if (status === 'IN_PROGRESS') return this.inProgressTasks();
    if (status === 'REVIEW') return this.reviewTasks();
    return this.doneTasks();
  }
}