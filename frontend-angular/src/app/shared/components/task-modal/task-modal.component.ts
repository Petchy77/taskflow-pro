import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, X } from 'lucide-angular';

import { ApiService } from '../../../core/services/api.service';
import { Project } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './task-modal.component.html'
})
export class TaskModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);

  @Input({ required: true }) isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() taskCreated = new EventEmitter<void>();

  protected XIcon = X;

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  projects = signal<Project[]>([]);

  taskForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    projectId: [0, [Validators.required, Validators.min(1)]],
    priority: ['MEDIUM', [Validators.required]],
    dueDate: ['']
  });

  ngOnInit(): void {
    this.apiService.getProjects().subscribe({
      next: (projects) => {
        this.projects.set(projects);
        if (projects.length > 0) {
          this.taskForm.patchValue({ projectId: projects[0].id });
        }
      }
    });
  }

  onClose(): void {
    this.taskForm.reset({
      title: '',
      description: '',
      projectId: this.projects()[0]?.id ?? 0,
      priority: 'MEDIUM',
      dueDate: ''
    });
    this.errorMessage.set(null);
    this.closeModal.emit();
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const formValue = this.taskForm.getRawValue();
    const payload: any = {
      title: formValue.title,
      description: formValue.description || undefined,
      projectId: formValue.projectId,
      priority: formValue.priority,
      dueDate: formValue.dueDate || undefined
    };

    this.apiService.createTask(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.taskCreated.emit();
        this.onClose();
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Failed to create task');
        this.isSubmitting.set(false);
      }
    });
  }
}