import { useEffect, useState } from 'react';
import { Loader2, ChevronLeft, ChevronRight, FileText, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { adminService } from '../services/adminService';
import type { AuditLog } from '../types';

const ACTION_COLORS: Record<string, string> = {
  ROLE_CHANGED: 'bg-purple-50 text-purple-700 border-purple-200',
  USER_ENABLED: 'bg-green-50 text-green-700 border-green-200',
  USER_DISABLED: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  USER_DELETED: 'bg-red-50 text-red-700 border-red-200',
};

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const loadLogs = async (pageNum: number) => {
    setLoading(true);
    try {
      const data = await adminService.getAuditLogs(pageNum, 20);
      setLogs(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setPage(data.number);
    } catch (err) {
      setError('Failed to load audit logs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs(0);
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600 mt-1">Track admin actions and system changes</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <p className="text-sm text-blue-700 font-medium">{totalElements} total entries</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No audit logs yet</p>
            <p className="text-sm mt-1">Actions will appear here when admins make changes</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Timestamp</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Admin</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Action</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Target</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm:ss')}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {log.username || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium border ${
                        ACTION_COLORS[log.action] || 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {log.targetType && (
                      <span className="font-mono text-xs">
                        {log.targetType}#{log.targetId}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{log.details || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
            <p className="text-sm text-gray-600">
              Page {page + 1} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => loadLogs(page - 1)}
                disabled={page === 0 || loading}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-white disabled:opacity-50 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={() => loadLogs(page + 1)}
                disabled={page >= totalPages - 1 || loading}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-white disabled:opacity-50 flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}