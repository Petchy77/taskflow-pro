import { useEffect, useState } from 'react';
import { Loader2, Trash2, Shield, ShieldOff, UserCog, AlertCircle } from 'lucide-react';
import { adminService } from '../services/adminService';
import { useAuth } from '../contexts/AuthContext';
import type { UserAdmin } from '../types';

export default function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionUserId, setActionUserId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const loadUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: number, newRole: 'USER' | 'ADMIN') => {
    setActionUserId(userId);
    try {
      await adminService.updateUserRole(userId, newRole);
      await loadUsers();
    } catch (err) {
      console.error(err);
      alert('Failed to update role');
    } finally {
      setActionUserId(null);
    }
  };

  const handleToggle = async (userId: number) => {
    setActionUserId(userId);
    try {
      await adminService.toggleUserStatus(userId);
      await loadUsers();
    } catch (err) {
      console.error(err);
      alert('Failed to toggle status');
    } finally {
      setActionUserId(null);
    }
  };

  const handleDelete = async (userId: number) => {
    setActionUserId(userId);
    try {
      await adminService.deleteUser(userId);
      setConfirmDelete(null);
      await loadUsers();
    } catch (err: unknown) {
      console.error(err);
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setActionUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <p className="text-sm text-blue-700 font-medium">{users.length} total users</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">User</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Email</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Role</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Tasks</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((u) => {
              const isSelf = u.id === currentUser?.id;
              const isProcessing = actionUserId === u.id;
              return (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {u.fullName?.charAt(0) || u.username.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {u.fullName || u.username}
                          {isSelf && <span className="ml-2 text-xs text-blue-600">(You)</span>}
                        </p>
                        <p className="text-sm text-gray-500">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                  <td className="px-6 py-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as 'USER' | 'ADMIN')}
                      disabled={isSelf || isProcessing}
                      className={`px-3 py-1 rounded-lg text-sm font-medium border ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      } disabled:opacity-50`}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        u.enabled
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${u.enabled ? 'bg-green-500' : 'bg-red-500'}`} />
                      {u.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{u.taskCount ?? 0}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggle(u.id)}
                        disabled={isSelf || isProcessing}
                        title={u.enabled ? 'Disable user' : 'Enable user'}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                      >
                        {u.enabled ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(u.id)}
                        disabled={isSelf || isProcessing}
                        title="Delete user"
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Confirm delete dialog */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <UserCog className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Delete User?</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={actionUserId === confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionUserId === confirmDelete && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}