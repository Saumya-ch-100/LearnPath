import { useState, useEffect } from 'react';
import { Clock, Target, BookOpen, TrendingUp, Zap, CheckCircle2, AlertCircle, Bell, MessageSquare, Heart } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [recentMilestones, setRecentMilestones] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [mentorFeedback, setMentorFeedback] = useState([]);
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 14d, 30d, 90d, all

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const requests = [
        axiosClient.get(`/progress/summary?range=${timeRange}`),
        axiosClient.get('/logs?limit=5'),
        axiosClient.get('/milestones?limit=5'),
        axiosClient.get('/user-skills'),
        axiosClient.get('/enrollments'),
        axiosClient.get('/milestones'),
      ];

      // Only fetch feedback if user has a mentor
      if (user?.mentorId) {
        requests.push(axiosClient.get('/feedback/my-feedback'));
      }

      const responses = await Promise.all(requests);
      const [progressRes, logsRes, milestonesRes, userSkillsRes, enrollmentsRes, allMilestonesRes, feedbackRes] = responses;

      // Add user skills count and total resources to progressData
      const enhancedProgressData = {
        ...progressRes.data,
        activeSkillsCount: Array.isArray(userSkillsRes.data) ? userSkillsRes.data.length : 0,
        totalResources: Array.isArray(enrollmentsRes.data) ? enrollmentsRes.data.length : 0,
        completedResources: Array.isArray(enrollmentsRes.data) 
          ? enrollmentsRes.data.filter(e => e.status === 'completed').length 
          : 0
      };

      // Filter upcoming and overdue milestones for reminders
      const allMilestones = Array.isArray(allMilestonesRes.data) ? allMilestonesRes.data : (allMilestonesRes.data.milestones || []);
      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const reminders = allMilestones
        .filter(m => m.status !== 'completed')
        .filter(m => {
          const targetDate = new Date(m.targetDate);
          return targetDate < sevenDaysFromNow; // Upcoming within 7 days or overdue
        })
        .sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate))
        .slice(0, 5);

      setProgressData(enhancedProgressData);
      setRecentLogs(Array.isArray(logsRes.data) ? logsRes.data : (logsRes.data.logs || []));
      setRecentMilestones(Array.isArray(milestonesRes.data) ? milestonesRes.data : (milestonesRes.data.milestones || []));
      setUpcomingReminders(reminders);
      setMentorFeedback(feedbackRes ? (Array.isArray(feedbackRes.data) ? feedbackRes.data.slice(0, 3) : []) : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const stats = [
    {
      icon: Clock,
      label: 'This Week',
      value: loading ? '...' : `${Math.round((progressData?.totalMinutesThisWeek || 0) / 60)}h`,
      change: progressData?.totalMinutesThisWeek > 0 ? 'Active' : 'Start logging',
      color: 'text-primary',
      bgColor: 'bg-gradient-to-br from-primary/20 to-primary/10',
    },
    {
      icon: Target,
      label: 'Active Skills',
      value: loading ? '...' : progressData?.activeSkillsCount || 0,
      change: 'In progress',
      color: 'text-teal',
      bgColor: 'bg-gradient-to-br from-teal/20 to-teal/10',
    },
    {
      icon: BookOpen,
      label: 'Resources',
      value: loading ? '...' : progressData?.totalResources || 0,
      change: `${progressData?.completedResources || 0} completed`,
      color: 'text-purple',
      bgColor: 'bg-gradient-to-br from-purple/20 to-purple/10',
    },
    {
      icon: TrendingUp,
      label: 'This Month',
      value: loading ? '...' : `${Math.round((progressData?.totalMinutesThisMonth || 0) / 60)}h`,
      change: 'Total hours',
      color: 'text-orange',
      bgColor: 'bg-gradient-to-br from-orange/20 to-orange/10',
    },
  ];

  const COLORS = ['#0066FF', '#14B8A6', '#8B5CF6', '#FF6B35', '#10b981', '#F59E0B'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'Learner'} 👋
        </h1>
        <p className="text-gray-600 text-lg">Your learning journey at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} hover>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium mb-2">{stat.label}</p>
                <p className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.change}</p>
              </div>
              <div className={`p-4 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={stat.color} size={28} strokeWidth={2.5} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Time Range Selector */}
      <Card>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Analytics Period</h3>
            <p className="text-sm text-gray-600">Select time range to view your learning data</p>
          </div>
          <div className="flex gap-2">
            {[
              { value: '7d', label: 'Last 7 Days' },
              { value: '14d', label: 'Last 14 Days' },
              { value: '30d', label: 'Last 30 Days' },
              { value: '90d', label: 'Last 90 Days' },
              { value: 'all', label: 'All Time' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value)}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  timeRange === option.value
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Progress Chart */}
        <Card className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-2xl">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
                <p className="text-sm text-gray-600 font-medium">Loading data...</p>
              </div>
            </div>
          )}
          {!loading && progressData && (
            <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Daily Progress</h3>
              <Badge variant="primary" className="text-xs">{timeRange === 'all' ? 'All Time' : timeRange.toUpperCase().replace('D', ' Days')}</Badge>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData.hoursByDay || []} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#6b7280' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '12px', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                  }}
                  labelStyle={{ color: '#374151', fontWeight: 600, marginBottom: '4px' }}
                  itemStyle={{ color: '#0066FF', fontSize: '14px' }}
                  formatter={(value) => [`${value} hours`, 'Learning Time']}
                  labelFormatter={(value) => new Date(value).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}
                />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#0066FF" 
                  strokeWidth={3}
                  dot={{ fill: '#0066FF', strokeWidth: 2, r: 4, stroke: '#ffffff' }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#ffffff' }}
                  fillOpacity={1}
                  fill="url(#colorHours)"
                />
              </LineChart>
            </ResponsiveContainer>
            </>
          )}
        </Card>

        {/* Skill Distribution */}
        <Card className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-2xl">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
                <p className="text-sm text-gray-600 font-medium">Loading data...</p>
              </div>
            </div>
          )}
          {!loading && progressData && (
            <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Hours by Skill</h3>
              <Zap className="text-orange" size={20} strokeWidth={2.5} />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={progressData.hoursBySkill || []}
                  dataKey="hours"
                  nameKey="skillName"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  label={({ skillName, hours, percent }) => `${skillName}: ${hours.toFixed(1)}h (${(percent * 100).toFixed(0)}%)`}
                  labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                  paddingAngle={2}
                >
                  {(progressData.hoursBySkill || []).map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '12px', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    padding: '12px'
                  }}
                  itemStyle={{ fontSize: '14px' }}
                  formatter={(value, name) => [`${value.toFixed(1)} hours`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            </>
          )}
        </Card>
      </div>

      {/* Mentor Feedback - Show if any exist */}
      {mentorFeedback.length > 0 && (
        <Card className="border-l-4 border-primary bg-gradient-to-r from-primary/5 to-transparent">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageSquare className="text-primary" size={22} strokeWidth={2.5} />
            Recent Feedback from Your Mentor
          </h3>
          <div className="space-y-3">
            {mentorFeedback.map((item) => (
              <div 
                key={item._id} 
                className="p-4 rounded-xl bg-white border-2 border-primary/20 hover:border-primary/40 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    item.type === 'encouragement' ? 'bg-success/10' :
                    item.type === 'concern' ? 'bg-warning/10' :
                    item.type === 'suggestion' ? 'bg-teal/10' : 'bg-primary/10'
                  }`}>
                    {item.type === 'encouragement' ? (
                      <Heart className={
                        item.type === 'encouragement' ? 'text-success' :
                        item.type === 'concern' ? 'text-warning' :
                        item.type === 'suggestion' ? 'text-teal' : 'text-primary'
                      } size={20} strokeWidth={2.5} />
                    ) : (
                      <MessageSquare className={
                        item.type === 'concern' ? 'text-warning' :
                        item.type === 'suggestion' ? 'text-teal' : 'text-primary'
                      } size={20} strokeWidth={2.5} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{item.mentorId?.name}</p>
                      <Badge variant={
                        item.type === 'encouragement' ? 'success' :
                        item.type === 'concern' ? 'warning' :
                        item.type === 'suggestion' ? 'teal' : 'primary'
                      } className="text-xs capitalize">
                        {item.type}
                      </Badge>
                    </div>
                    <p className="text-gray-700 mb-1">{item.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString('en', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Upcoming Reminders - Show if any exist */}
      {upcomingReminders.length > 0 && (
        <Card className="border-l-4 border-warning bg-gradient-to-r from-warning/5 to-transparent">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Bell className="text-warning" size={22} strokeWidth={2.5} />
            Upcoming & Overdue Reminders
          </h3>
          <div className="space-y-3">
            {upcomingReminders.map((milestone) => {
              const targetDate = new Date(milestone.targetDate);
              const now = new Date();
              const isOverdue = targetDate < now;
              const daysUntil = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));
              
              let timeText = '';
              if (isOverdue) {
                const daysOverdue = Math.abs(daysUntil);
                timeText = daysOverdue === 0 ? 'Due today!' : `${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue`;
              } else {
                timeText = daysUntil === 0 ? 'Due today!' : `${daysUntil} day${daysUntil > 1 ? 's' : ''} left`;
              }

              return (
                <div 
                  key={milestone._id} 
                  className={`flex items-start gap-4 p-4 rounded-xl transition-all border-2 ${
                    isOverdue 
                      ? 'bg-danger/10 border-danger/30 hover:border-danger/50' 
                      : 'bg-warning/10 border-warning/30 hover:border-warning/50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isOverdue ? 'bg-danger/20' : 'bg-warning/20'}`}>
                    <AlertCircle className={isOverdue ? 'text-danger' : 'text-warning'} size={20} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-bold">{milestone.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{milestone.description || 'No description'}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={isOverdue ? 'danger' : 'warning'} className="text-xs">
                        {timeText}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {targetDate.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Recent Activity & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Logs */}
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="text-primary" size={22} strokeWidth={2.5} />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {loading ? (
              <p className="text-gray-500 text-sm">Loading...</p>
            ) : recentLogs.length > 0 ? (
              recentLogs.map((log) => (
                <div key={log._id} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all border border-gray-100">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BookOpen className="text-primary" size={18} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-semibold truncate">{log.skillId?.name || 'General Learning'}</p>
                    <p className="text-xs text-gray-500 mt-1">{log.notes || 'No notes'}</p>
                    <p className="text-sm text-gray-900 font-bold mt-1">{Math.round(log.durationMinutes / 60 * 10) / 10}h</p>
                  </div>
                  <span className="text-xs text-gray-500 shrink-0 font-medium">
                    {new Date(log.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-8">No activity yet. Start logging your learning!</p>
            )}
          </div>
        </Card>

        {/* Recent Milestones */}
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Target className="text-teal" size={22} strokeWidth={2.5} />
            Milestones
          </h3>
          <div className="space-y-3">
            {loading ? (
              <p className="text-gray-500 text-sm">Loading...</p>
            ) : recentMilestones.length > 0 ? (
              recentMilestones.map((milestone) => {
                const isCompleted = milestone.status === 'completed';
                const isOverdue = !isCompleted && new Date(milestone.targetDate) < new Date();
                return (
                  <div key={milestone._id} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all border border-gray-100">
                    <div className={`p-2 rounded-lg ${isCompleted ? 'bg-success/10' : isOverdue ? 'bg-danger/10' : 'bg-teal/10'}`}>
                      {isCompleted ? (
                        <CheckCircle2 className="text-success" size={18} strokeWidth={2.5} />
                      ) : isOverdue ? (
                        <AlertCircle className="text-danger" size={18} strokeWidth={2.5} />
                      ) : (
                        <Target className="text-teal" size={18} strokeWidth={2.5} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-semibold truncate">{milestone.title}</p>
                      <p className="text-xs text-gray-500 font-medium">Target: {new Date(milestone.targetDate).toLocaleDateString()}</p>
                      {isCompleted && (
                        <Badge variant="success" className="text-xs mt-2">Completed</Badge>
                      )}
                      {isOverdue && !isCompleted && (
                        <Badge variant="danger" className="text-xs mt-2">Overdue</Badge>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-sm text-center py-8">No milestones yet. Set your first goal!</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
