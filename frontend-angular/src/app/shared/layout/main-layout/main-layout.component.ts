import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, ListTodo, LogOut, Kanban } from 'lucide-angular';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {
  private authService = inject(AuthService);

  protected DashboardIcon = LayoutDashboard;
  protected TasksIcon = ListTodo;
  protected BoardIcon = Kanban;
  protected LogOutIcon = LogOut;

  user = this.authService.currentUser;

  userInitials(): string {
    const fullName = this.user()?.fullName ?? '';
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  logout(): void {
    this.authService.logout();
  }
}