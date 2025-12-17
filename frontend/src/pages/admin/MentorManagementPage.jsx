import { useState, useEffect } from 'react';
import { Users, Mail, UserCheck } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';

const MentorManagementPage = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await axiosClient.get('/mentors');
      setMentors(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Spinner size="lg" />
        <p className="text-gray-500 font-medium">Loading mentors...</p>
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
            Mentor Management
          </h1>
          <p className="text-gray-600 mt-1">View all mentors and their assigned learners</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Mentors</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{mentors.length}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl">
              <Users className="text-primary" size={24} strokeWidth={2.5} />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Available</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {mentors.filter(m => m.isAcceptingLearners).length}
              </p>
            </div>
            <div className="p-3 bg-success/10 rounded-xl">
              <UserCheck className="text-success" size={24} strokeWidth={2.5} />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Learners</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {mentors.reduce((sum, m) => sum + m.currentLearners, 0)}
              </p>
            </div>
            <div className="p-3 bg-teal/10 rounded-xl">
              <Users className="text-teal" size={24} strokeWidth={2.5} />
            </div>
          </div>
        </Card>
      </div>

      {/* Mentors List */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">All Mentors</h2>

        {mentors.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 text-lg">No mentors in the system</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Mentor</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Specializations</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Learners</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {mentors.map((mentor) => (
                  <tr key={mentor._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold">
                          {mentor.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{mentor.name}</p>
                          {mentor.bio && (
                            <p className="text-xs text-gray-500 line-clamp-1 max-w-xs">{mentor.bio}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} />
                        {mentor.email}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {mentor.specializations && mentor.specializations.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {mentor.specializations.slice(0, 3).map((spec, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                          {mentor.specializations.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{mentor.specializations.length - 3}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">None</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-sm font-medium text-gray-900">
                        {mentor.currentLearners}/{mentor.maxLearners}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {mentor.isAcceptingLearners ? (
                        <Badge variant="success">Available</Badge>
                      ) : (
                        <Badge variant="secondary">Full</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MentorManagementPage;
