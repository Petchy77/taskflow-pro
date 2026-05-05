import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Lock, User, AlertCircle } from 'lucide-angular';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <span class="text-3xl">🚀</span>
          </div>
          <h1 class="text-3xl font-bold text-gray-900">TaskFlow Pro</h1>
          <p class="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <!-- Error message -->
        @if (errorMessage()) {
          <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <lucide-icon [img]="AlertCircleIcon" class="text-red-500 mt-0.5" [size]="20" />
            <p class="text-sm text-red-700">{{ errorMessage() }}</p>
          </div>
        }

        <!-- Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
          <!-- Username -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div class="relative">
              <lucide-icon [img]="UserIcon" class="absolute left-3 top-3 text-gray-400" [size]="20" />
              <input
                type="text"
                formControlName="username"
                placeholder="petch"
                autocomplete="username"
                class="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>
            @if (loginForm.get('username')?.touched && loginForm.get('username')?.errors) {
              <p class="text-xs text-red-600 mt-1">Username is required</p>
            }
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div class="relative">
              <lucide-icon [img]="LockIcon" class="absolute left-3 top-3 text-gray-400" [size]="20" />
              <input
                type="password"
                formControlName="password"
                placeholder="••••••••"
                autocomplete="current-password"
                class="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>
            @if (loginForm.get('password')?.touched && loginForm.get('password')?.errors) {
              <p class="text-xs text-red-600 mt-1">Password is required</p>
            }
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            [disabled]="loginForm.invalid || isLoading()"
            class="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition shadow-md hover:shadow-lg"
          >
            @if (isLoading()) {
              <span>Signing in...</span>
            } @else {
              <span>Sign in</span>
            }
          </button>
        </form>

        <!-- Demo credentials -->
        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
          <p class="text-xs font-semibold text-gray-700 mb-2">Demo Credentials:</p>
          <div class="space-y-1 text-xs text-gray-600">
            <p><code class="bg-white px-2 py-0.5 rounded">petch</code> / <code class="bg-white px-2 py-0.5 rounded">petch123</code></p>
            <p><code class="bg-white px-2 py-0.5 rounded">admin</code> / <code class="bg-white px-2 py-0.5 rounded">admin123</code></p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Icons
  protected UserIcon = User;
  protected LockIcon = Lock;
  protected AlertCircleIcon = AlertCircle;

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage.set(
          err.error?.message || 'Login failed. Please check your credentials.'
        );
        this.isLoading.set(false);
      }
    });
  }
}
