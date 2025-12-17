import { useState, useEffect } from 'react';
import { Users, TrendingUp, Clock, Target, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';

const MentorDashboardPage = () => {
  const navigate = useNavigate();
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLearners: 0,
    activeThisWeek: 0,
    totalHoursThisWeek: 0,
    avgHoursPerLearner: 0,
  });

  useEffect(() => {
    fetchMyLearners();
  }, []);

  const fetchMyLearners = async () => {
    try {
      const response = await axiosClient.get('/mentors/my-learners');
      setLearners(response.data);

      // Calculate stats
      const activeThisWeek = response.data.filter(l => l.progress.hoursThisWeek > 0).length;
      const totalHours = response.data.reduce((sum, l) => sum + l.progress.hoursThisWeek, 0);

      setStats({
        totalLearners: response.data.length,
        activeThisWeek,
        totalHoursThisWeek: totalHours.toFixed(1),
        avgHoursPerLearner: (totalHours / (response.data.length || 1)).toFixed(1),
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching learners:', error);
      setLoading(false);
    }
  };

  const handleViewProgress = (learnerId) => {
    navigate(`/mentor/learner/${learnerId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Spinner size="lg" />
        <p className="text-gray-500 font-medium">Loading learners...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="text-primary" size={32} strokeWidth={2.5} />
            My Learners
          </h1>
          <p className="text-gray-600 mt-1">Monitor and guide your assigned learners</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Learners</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalLearners}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl">
              <Users className="text-primary" size={24} strokeWidth={2.5} />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Active This Week</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeThisWeek}</p>
            </div>
            <div className="p-3 bg-success/10 rounded-xl">
              <TrendingUp className="text-success" size={24} strokeWidth={2.5} />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalHoursThisWeek}h</p>
            </div>
            <div className="p-3 bg-teal/10 rounded-xl">
              <Clock className="text-teal" size={24} strokeWidth={2.5} />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Avg Hours/Learner</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgHoursPerLearner}h</p>
            </div>
            <div className="p-3 bg-warning/10 rounded-xl">
              <Target className="text-warning" size={24} strokeWidth={2.5} />
            </div>
          </div>
        </Card>
      </div>

      {/* Learners List */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Learner Progress</h2>
        
        {learners.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 text-lg">No learners assigned yet</p>
            <p className="text-gray-400 text-sm mt-2">Learners will appear here when they select you as their mentor</p>
          </div>
        ) : (
          <div className="space-y-3">
            {learners.map((learner) => (
              <div
                key={learner._id}
                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 transition-all cursor-pointer"
                onClick={() => handleViewProgress(learner._id)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-lg">
                    {learner.name.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{learner.name}</h3>
                    <p className="text-sm text-gray-500">{learner.headline || learner.email}</p>
                  </div>

                  <div className="flex items-center gap-6 mr-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{learner.progress.skillsCount}</p>
                      <p className="text-xs text-gray-500 font-medium">Skills</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-teal">{learner.progress.hoursThisWeek}h</p>
                      <p className="text-xs text-gray-500 font-medium">This Week</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-warning">{learner.progress.activeMilestones}</p>
                      <p className="text-xs text-gray-500 font-medium">Milestones</p>
                    </div>
                  </div>

                  {learner.progress.hoursThisWeek > 0 ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>

                <ArrowRight className="text-gray-400" size={20} strokeWidth={2.5} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default MentorDashboardPage;
