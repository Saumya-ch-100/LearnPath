import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';
import NotificationBell from '../notifications/NotificationBell';
import axiosClient from '../../api/axiosClient';

const TopNav = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (user?.role === 'learner') {
      fetchStreak();
    }
  }, [user]);

  const fetchStreak = async () => {
    try {
      const { data } = await axiosClient.get('/progress/streak');
      setStreak(data.streak || 0);
    } catch (error) {
      console.error('Failed to fetch streak:', error);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search resources, skills, milestones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Streak Badge - Only for learners */}
        {user?.role === 'learner' && (
          <button 
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange/10 to-orange/5 border border-orange/20 hover:from-orange/15 hover:to-orange/10 transition-all"
            title="Your learning streak"
          >
            <Sparkles size={16} className="text-orange" />
            <span className="text-sm font-semibold text-orange">{streak} day streak 🔥</span>
          </button>
        )}

        {/* Notifications */}
        <NotificationBell />

        {/* User Avatar - Clickable */}
        <button 
          onClick={() => navigate('/profile')}
          className="hover:opacity-80 transition-opacity"
          title="View profile"
        >
          <Avatar size="md" initials={user?.name?.split(' ').map(n => n[0]).join('') || 'U'} />
        </button>
      </div>
    </header>
  );
};

export default TopNav;
