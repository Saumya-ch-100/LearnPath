import { useState, useEffect } from 'react';
import { Users, BookOpen, Target, Shield, Plus, Settings, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import axiosClient from '../../api/axiosClient';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await axiosClient.get('/admin/analytics');
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      alert('Failed to load analytics. Make sure you have admin permissions.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-zinc-400">Loading admin dashboard...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-red-500">Failed to load analytics. Access denied.</div>
      </div>
    );
  }

  const quickActions = [
    {
      icon: Target,
      label: 'Manage Skills',
      description: 'Add, edit, or remove skills',
      color: 'teal',
      action: () => navigate('/admin/skills')
    },
    {
      icon: BookOpen,
      label: 'Manage Resources',
      description: 'Add, edit, or remove learning resources',
      color: 'purple',
      action: () => navigate('/admin/resources')
    },
    {
      icon: Users,
      label: 'Manage Users',
      description: 'View and manage user accounts',
      color: 'primary',
      action: () => navigate('/admin/users')
    }
  ];

  const stats = [
    {
      icon: Users,
      label: 'Total Users',
      value: analytics.totalUsers,
      color: 'primary',
      bgGradient: 'from-primary/20 to-primary/10',
      borderColor: 'border-primary'
    },
    {
      icon: Database,
      label: 'Total Skills',
      value: analytics.totalSkills,
      color: 'teal',
      bgGradient: 'from-teal/20 to-teal/10',
      borderColor: 'border-teal'
    },
    {
      icon: BookOpen,
      label: 'Total Resources',
      value: analytics.totalResources,
      color: 'purple',
      bgGradient: 'from-purple/20 to-purple/10',
      borderColor: 'border-purple'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center gap-3">
            <Shield size={36} className="text-orange" strokeWidth={2.5} />
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Platform management and control</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Settings size={24} className="text-orange" strokeWidth={2.5} />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Card 
              key={action.label} 
              className="cursor-pointer hover:shadow-xl transition-all hover:scale-105"
              onClick={action.action}
            >
              <div className="flex flex-col items-center text-center p-4">
                <div className={`p-4 bg-gradient-to-br from-${action.color}/20 to-${action.color}/10 rounded-xl border-2 border-${action.color} mb-4`}>
                  <action.icon size={32} className={`text-${action.color}`} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{action.label}</h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Platform Statistics */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 bg-gradient-to-br ${stat.bgGradient} rounded-xl border-2 ${stat.borderColor}`}>
                  <stat.icon size={24} className={`text-${stat.color}`} strokeWidth={2.5} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* User Role Distribution */}
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl border-2 border-primary">
            <Users size={24} className="text-primary" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">User Distribution</h3>
            <p className="text-gray-600 text-sm">Users by role</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-primary/5 rounded-xl border border-primary/20">
            <p className="text-3xl font-bold text-primary mb-1">{analytics.roleDistribution.learners}</p>
            <p className="text-gray-600 text-sm font-medium">Learners</p>
          </div>
          <div className="text-center p-4 bg-purple/5 rounded-xl border border-purple/20">
            <p className="text-3xl font-bold text-purple mb-1">{analytics.roleDistribution.mentors}</p>
            <p className="text-gray-600 text-sm font-medium">Mentors</p>
          </div>
          <div className="text-center p-4 bg-orange/5 rounded-xl border border-orange/20">
            <p className="text-3xl font-bold text-orange mb-1">{analytics.roleDistribution.admins}</p>
            <p className="text-gray-600 text-sm font-medium">Admins</p>
          </div>
        </div>
      </Card>

      {/* Recent Users */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Users</h3>
        <div className="space-y-3">
          {analytics.recentUsers.map((user) => (
            <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge 
                  variant={
                    user.role === 'admin' ? 'orange' : 
                    user.role === 'mentor' ? 'purple' : 
                    'primary'
                  }
                >
                  {user.role}
                </Badge>
                <p className="text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
