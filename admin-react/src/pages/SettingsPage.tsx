import { Server, Database, Shield, Cpu, Globe, Code2 } from 'lucide-react';

export default function SettingsPage() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

  const sections = [
    {
      title: 'System Info',
      icon: Server,
      color: 'from-blue-500 to-blue-600',
      items: [
        { label: 'Application', value: 'TaskFlow Pro' },
        { label: 'Version', value: '1.0.0' },
        { label: 'Environment', value: import.meta.env.MODE },
        { label: 'Build Date', value: new Date().toLocaleDateString() },
      ],
    },
    {
      title: 'Backend',
      icon: Database,
      color: 'from-purple-500 to-purple-600',
      items: [
        { label: 'API URL', value: apiUrl },
        { label: 'Framework', value: 'Spring Boot 4.0' },
        { label: 'Database', value: 'MySQL 8' },
        { label: 'Cache', value: 'Redis 7' },
      ],
    },
    {
      title: 'Frontend',
      icon: Code2,
      color: 'from-green-500 to-green-600',
      items: [
        { label: 'Framework', value: 'React 18 + TypeScript' },
        { label: 'Build Tool', value: 'Vite 6' },
        { label: 'Styling', value: 'Tailwind CSS 3' },
        { label: 'Charts', value: 'Recharts 2' },
      ],
    },
    {
      title: 'Security',
      icon: Shield,
      color: 'from-red-500 to-red-600',
      items: [
        { label: 'Authentication', value: 'JWT (Bearer Token)' },
        { label: 'Authorization', value: 'Role-Based (USER/ADMIN)' },
        { label: 'Password', value: 'BCrypt Hashed' },
        { label: 'CORS', value: 'Configured' },
      ],
    },
    {
      title: 'Infrastructure',
      icon: Cpu,
      color: 'from-orange-500 to-orange-600',
      items: [
        { label: 'Backend Host', value: 'Railway' },
        { label: 'Frontend Host', value: 'Vercel' },
        { label: 'CI/CD', value: 'GitHub Actions' },
        { label: 'Containerization', value: 'Docker + Kubernetes' },
      ],
    },
    {
      title: 'Features',
      icon: Globe,
      color: 'from-pink-500 to-pink-600',
      items: [
        { label: 'Real-time', value: 'WebSocket (STOMP)' },
        { label: 'API Docs', value: 'OpenAPI / Swagger' },
        { label: 'Migrations', value: 'Flyway' },
        { label: 'Monitoring', value: 'Spring Actuator' },
      ],
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">System information and configuration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className={`w-10 h-10 bg-gradient-to-br ${section.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">{section.title}</h3>
              </div>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div key={item.label} className="flex justify-between items-start gap-2">
                    <span className="text-sm text-gray-500">{item.label}</span>
                    <span className="text-sm font-medium text-gray-900 text-right break-all">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
        <h3 className="font-semibold text-gray-900 mb-2">📚 About TaskFlow Pro</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          A full-stack task management portfolio project demonstrating modern web development practices.
          Built with Spring Boot, React, TypeScript, MySQL, Redis, Docker, and deployed on Railway + Vercel.
          Features JWT authentication, role-based authorization, real-time updates, audit logging,
          and a complete CI/CD pipeline.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {['Spring Boot', 'React', 'TypeScript', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'WebSocket', 'JWT', 'CI/CD'].map((tag) => (
            <span key={tag} className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}