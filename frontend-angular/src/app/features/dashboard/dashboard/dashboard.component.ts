import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ListTodo, Clock, CheckCircle2, AlertTriangle } from 'lucide-angular';

import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private apiService = inject(ApiService);

  protected TasksIcon = ListTodo;
  protected ClockIcon = Clock;
  protected CheckIcon = CheckCircle2;
  protected AlertIcon = AlertTriangle;

  user = this.authService.currentUser;
  isLoading = signal(true);
  allTasks = signal<Task[]>([]);

  recentTasks = computed(() => this.allTasks().slice(0, 5));

  stats = computed(() => {
    const tasks = this.allTasks();
    return {
      total: tasks.length,
      inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
      done: tasks.filter(t => t.status === 'DONE').length,
      urgent: tasks.filter(t => t.priority === 'URGENT').length
    };
  });

  ngOnInit(): void {
    this.apiService.getTasks({ size: 100 }).subscribe({
      next: (response) => {
        this.allTasks.set(response.content);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  statusColorClass(status: string): string {
    const map: Record<string, string> = {
      TODO: 'bg-gray-400',
      IN_PROGRESS: 'bg-yellow-500',
      REVIEW: 'bg-purple-500',
      DONE: 'bg-green-500'
    };
    return map[status] ?? 'bg-gray-400';
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