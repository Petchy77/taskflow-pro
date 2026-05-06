export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
  user: User;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  totalTasks: number;
  tasksByStatus: Record<string, number>;
  tasksByPriority: Record<string, number>;
  completedThisMonth: number;
  overdueTasks: number;
}

export interface UserAdmin {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
  enabled: boolean;
  taskCount: number;
  createdAt: string;
}

export interface AuditLog {
  id: number;
  username?: string;
  action: string;
  targetType?: string;
  targetId?: number;
  details?: string;
  ipAddress?: string;
  createdAt: string;
}