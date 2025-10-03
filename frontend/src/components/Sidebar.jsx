import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, FileText, Calendar, Sparkles } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/preferences', icon: Settings, label: 'Preferences' },
    { path: '/generate', icon: Sparkles, label: 'Generate Content' },
    { path: '/posts', icon: FileText, label: 'My Posts' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
  ];

  return (
    <aside className="w-64 bg-gray-800 min-h-screen text-white">
      <nav className="mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-6 py-3 transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
