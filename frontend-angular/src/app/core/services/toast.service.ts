import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  private toastsSignal = signal<Toast[]>([]);

  toasts = this.toastsSignal.asReadonly();

  success(message: string): void {
    this.show('success', message);
  }

  error(message: string): void {
    this.show('error', message);
  }

  info(message: string): void {
    this.show('info', message);
  }

  private show(type: ToastType, message: string): void {
    const id = ++this.nextId;
    const toast: Toast = { id, type, message };

    this.toastsSignal.update(toasts => [...toasts, toast]);

    // Auto-dismiss after 3 seconds
    setTimeout(() => this.dismiss(id), 3000);
  }

  dismiss(id: number): void {
    this.toastsSignal.update(toasts => toasts.filter(t => t.id !== id));
  }
}