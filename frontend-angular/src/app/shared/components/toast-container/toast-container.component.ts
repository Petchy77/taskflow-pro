import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CheckCircle2, AlertCircle, Info, X } from 'lucide-angular';

import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './toast-container.component.html'
})
export class ToastContainerComponent {
  protected toastService = inject(ToastService);

  protected SuccessIcon = CheckCircle2;
  protected ErrorIcon = AlertCircle;
  protected InfoIcon = Info;
  protected XIcon = X;

  toasts = this.toastService.toasts;

  iconFor(type: string) {
    if (type === 'success') return this.SuccessIcon;
    if (type === 'error') return this.ErrorIcon;
    return this.InfoIcon;
  }

  toastClass(type: string): string {
    const map: Record<string, string> = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800'
    };
    return map[type] ?? map['info'];
  }

  iconColor(type: string): string {
    const map: Record<string, string> = {
      success: 'text-green-600',
      error: 'text-red-600',
      info: 'text-blue-600'
    };
    return map[type] ?? map['info'];
  }

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }
}