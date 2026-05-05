import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Task, Project, PageResponse, TaskStatus, Priority } from '../models/task.model';
import { environment } from '../../../environments/environment';

interface TaskFilter {
  status?: TaskStatus;
  priority?: Priority;
  projectId?: number;
  page?: number;
  size?: number;
  sort?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  // ==================== Projects ====================
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/projects`);
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/projects/${id}`);
  }

  createProject(data: { name: string; description?: string }): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}/projects`, data);
  }

  // ==================== Tasks ====================
  getTasks(filter: TaskFilter = {}): Observable<PageResponse<Task>> {
    let params = new HttpParams();
    if (filter.status) params = params.set('status', filter.status);
    if (filter.priority) params = params.set('priority', filter.priority);
    if (filter.projectId) params = params.set('projectId', filter.projectId.toString());
    if (filter.page !== undefined) params = params.set('page', filter.page.toString());
    if (filter.size !== undefined) params = params.set('size', filter.size.toString());
    if (filter.sort) params = params.set('sort', filter.sort);

    return this.http.get<PageResponse<Task>>(`${this.baseUrl}/tasks`, { params });
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/tasks/${id}`);
  }

  createTask(data: any): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/tasks`, data);
  }

  updateTask(id: number, data: any): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/tasks/${id}`, data);
  }

  updateTaskStatus(id: number, status: TaskStatus): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}/tasks/${id}/status`, { status });
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tasks/${id}`);
  }
}
