import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Filter, RefreshCw, Plus } from 'lucide-angular';

import { ApiService } from '../../../core/services/api.service';
import { Task, TaskStatus, Priority } from '../../../core/models/task.model';
import { TaskModalComponent } from '../../../shared/components/task-modal/task-modal.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, TaskModalComponent],
  templateUrl: './task-list.component.html'
})
export class TaskListComponent implements OnInit {
  private apiService = inject(ApiService);

  protected FilterIcon = Filter;
  protected RefreshIcon = RefreshCw;
  protected PlusIcon = Plus;

  tasks = signal<Task[]>([]);
  isLoading = signal(true);
  isModalOpen = signal(false);

  statusFilter: TaskStatus | '' = '';
  priorityFilter: Priority | '' = '';

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading.set(true);
    this.apiService.getTasks({
      status: this.statusFilter || undefined,
      priority: this.priorityFilter || undefined,
      size: 50
    }).subscribe({
      next: (response) => {
        this.tasks.set(response.content);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  clearFilters(): void {
    this.statusFilter = '';
    this.priorityFilter = '';
    this.loadTasks();
  }

  onStatusChange(task: Task, event: Event): void {
    const newStatus = (event.target as HTMLSelectElement).value as TaskStatus;
    this.apiService.updateTaskStatus(task.id, newStatus).subscribe({
      next: (updated) => {
        this.tasks.update(tasks =>
          tasks.map(t => t.id === task.id ? updated : t)
        );
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

  statusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      TODO: 'bg-gray-100 text-gray-700',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
      REVIEW: 'bg-purple-100 text-purple-700',
      DONE: 'bg-green-100 text-green-700'
    };
    return map[status] ?? 'bg-gray-100 text-gray-700';
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