import { Link, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  BookOpen, 
  ScrollText, 
  Trophy, 
  User,
  Shield,
  Users,
  GraduationCap,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

const Sidebar = () => {
  const { user, logout } = useAuth();
  
  // Admin users only see admin-specific navigation
  const navItems = user?.role === 'admin' ? [
    { to: '/admin', icon: Shield, label: 'Dashboard' },
    { to: '/admin/skills', icon: Target, label: 'Skills' },
    { to: '/admin/resources', icon: BookOpen, label: 'Resources' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/mentors', icon: GraduationCap, label: 'Mentors' },
  ] : user?.role === 'mentor' ? [
    { to: '/mentor', icon: GraduationCap, label: 'My Learners' },
    { to: '/profile', icon: User, label: 'Profile' },
  ] : [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/skills', icon: Target, label: 'Skills' },
    { to: '/resources', icon: BookOpen, label: 'Resources' },
    { to: '/logs', icon: ScrollText, label: 'Learning Logs' },
    { to: '/milestones', icon: Trophy, label: 'Milestones' },
  ];

  const roleItems = [];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link to={user?.role === 'admin' ? '/admin' : user?.role === 'mentor' ? '/mentor' : '/dashboard'} className="flex items-center space-x-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-teal flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
            <GraduationCap size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">LearnPath</h1>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              Learn & Grow <Sparkles size={10} />
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin' || item.to === '/dashboard' || item.to === '/mentor'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <item.icon size={20} strokeWidth={2.5} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all">
          <Avatar size="md" initials={user?.name?.split(' ').map(n => n[0]).join('') || 'U'} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role || 'learner'}</p>
          </div>
          <button 
            onClick={logout}
            className="text-gray-400 hover:text-danger transition-colors p-2 hover:bg-danger/10 rounded-lg"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
