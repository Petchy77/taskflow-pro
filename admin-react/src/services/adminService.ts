import api from './api';
import type { AdminStats, UserAdmin, AuditLog } from '../types';

export const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const { data } = await api.get<AdminStats>('/admin/stats');
    return data;
  },

  getUsers: async (): Promise<UserAdmin[]> => {
    const { data } = await api.get<UserAdmin[]>('/admin/users');
    return data;
  },

  updateUserRole: async (userId: number, role: 'USER' | 'ADMIN'): Promise<UserAdmin> => {
    const { data } = await api.patch<UserAdmin>(`/admin/users/${userId}/role`, { role });
    return data;
  },

  toggleUserStatus: async (userId: number): Promise<UserAdmin> => {
    const { data } = await api.patch<UserAdmin>(`/admin/users/${userId}/toggle`);
    return data;
  },

  deleteUser: async (userId: number): Promise<void> => {
    await api.delete(`/admin/users/${userId}`);
  },

  getAuditLogs: async (page = 0, size = 20): Promise<{
    content: AuditLog[];
    totalElements: number;
    totalPages: number;
    number: number;
  }> => {
    const { data } = await api.get(`/admin/audit-logs?page=${page}&size=${size}`);
    return data;
  },
};