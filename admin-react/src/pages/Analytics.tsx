import { useEffect, useState } from 'react';
import { Loader2, TrendingUp, Target, Clock, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, RadialBarChart, RadialBar } from 'recharts';
import { adminService } from '../services/adminService';
import type { AdminStats } from '../types';

export default function Analytics() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  // Computed metrics
  const completionRate = stats.totalTasks > 0
    ? Math.round(((stats.tasksByStatus.DONE || 0) / stats.totalTasks) * 100)
    : 0;

  const inProgressRate = stats.totalTasks > 0
    ? Math.round(((stats.tasksByStatus.IN_PROGRESS || 0) / stats.totalTasks) * 100)
    : 0;

  const overdueRate = stats.totalTasks > 0
    ? Math.round((stats.overdueTasks / stats.totalTasks) * 100)
    : 0;

  const tasksPerUser = stats.totalUsers > 0
    ? (stats.totalTasks / stats.totalUsers).toFixed(1)
    : '0';

  const statusData = Object.entries(stats.tasksByStatus).map(([name, value]) => ({
    name: name.replace('_', ' '),
    value,
  }));

  const priorityData = Object.entries(stats.tasksByPriority).map(([name, value]) => ({
    name,
    value,
    fill:
      name === 'URGENT' ? '#ef4444' :
      name === 'HIGH' ? '#f59e0b' :
      name === 'MEDIUM' ? '#3b82f6' : '#10b981',
  }));

  const completionData = [
    { name: 'Completed', value: completionRate, fill: '#10b981' },
  ];

  const insights = [
    { label: 'Completion Rate', value: `${completionRate}%`, icon: CheckCircle2, color: 'from-green-500 to-emerald-600', desc: 'Tasks marked as done' },
    { label: 'In Progress', value: `${inProgressRate}%`, icon: Clock, color: 'from-blue-500 to-blue-600', desc: 'Currently being worked on' },
    { label: 'Overdue Rate', value: `${overdueRate}%`, icon: Target, color: 'from-red-500 to-red-600', desc: 'Past due date' },
    { label: 'Tasks per User', value: tasksPerUser, icon: TrendingUp, color: 'from-purple-500 to-purple-600', desc: 'Avg workload' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Deep insights into task performance</p>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {insights.map((insight) => {
          const Icon = insight.icon;
          return (
            <div key={insight.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className={`w-12 h-12 bg-gradient-to-br ${insight.color} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{insight.value}</p>
              <p className="text-sm font-medium text-gray-700 mt-1">{insight.label}</p>
              <p className="text-xs text-gray-500 mt-1">{insight.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Completion Rate Radial */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Completion Progress</h3>
          <p className="text-sm text-gray-500 mb-4">Overall completion across all tasks</p>
          <ResponsiveContainer width="100%" height={250}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="100%" data={completionData} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={20} background={{ fill: '#f3f4f6' }} />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-4xl font-bold" fill="#10b981">
                {completionRate}%
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Priority Distribution</h3>
          <p className="text-sm text-gray-500 mb-4">Breakdown of tasks by priority level</p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={priorityData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Status Breakdown</h3>
        <p className="text-sm text-gray-500 mb-4">Number of tasks in each workflow stage</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData} layout="vertical">
            <XAxis type="number" allowDecimals={false} />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="value" radius={[0, 8, 8, 0]} fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Productivity Summary */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <p className="text-white/80 text-sm">This Month's Productivity</p>
            <div className="flex items-baseline gap-3 mt-1">
              <p className="text-4xl font-bold">{stats.completedThisMonth}</p>
              <p className="text-white/80">tasks completed</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-sm">Total System</p>
            <p className="text-2xl font-bold">{stats.totalTasks} tasks</p>
          </div>
        </div>
      </div>
    </div>
  );
}