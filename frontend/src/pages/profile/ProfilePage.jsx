import { useState, useEffect } from 'react';
import { Mail, Calendar, Edit, Lock, Trash2, Settings, Users, MessageSquare, Heart } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import EditProfileModal from './EditProfileModal';
import ChangePasswordModal from './ChangePasswordModal';
import DeleteAccountModal from './DeleteAccountModal';
import EditPreferencesModal from './EditPreferencesModal';
import EditMentorProfileModal from './EditMentorProfileModal';
import AssignMentorModal from '../../components/mentor/AssignMentorModal';
import AskQuestionModal from '../../components/modals/AskQuestionModal';
import QuestionsSection from '../../components/questions/QuestionsSection';
import axiosClient from '../../api/axiosClient';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showEditMentorModal, setShowEditMentorModal] = useState(false);
  const [showAssignMentorModal, setShowAssignMentorModal] = useState(false);
  const [showRemoveMentorConfirm, setShowRemoveMentorConfirm] = useState(false);
  const [showAskQuestionModal, setShowAskQuestionModal] = useState(false);
  const [mentor, setMentor] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);

  useEffect(() => {
    if (user?.role === 'learner' && user?.mentorId) {
      fetchMentor();
      fetchFeedback();
      fetchQuestions();
    }
  }, [user]);

  const fetchMentor = async () => {
    try {
      const response = await axiosClient.get('/mentors');
      const currentMentor = response.data.find(m => m._id === user.mentorId);
      setMentor(currentMentor);
    } catch (error) {
      console.error('Error fetching mentor:', error);
    }
  };

  const fetchFeedback = async () => {
    try {
      const response = await axiosClient.get('/feedback/my-feedback');
      setFeedback(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axiosClient.get('/questions/my-questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAskQuestion = async (question) => {
    setIsLoadingQuestion(true);
    try {
      await axiosClient.post('/questions', { question });
      await fetchQuestions();
      setShowAskQuestionModal(false);
    } catch (error) {
      console.error('Error asking question:', error);
      alert('Failed to send question');
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  const handleMentorAssigned = (assignedMentor) => {
    setMentor(assignedMentor);
    updateUser({ ...user, mentorId: assignedMentor._id });
  };

  const handleRemoveMentor = async () => {
    try {
      await axiosClient.delete(`/learners/${user.id}/mentor`);
      setMentor(null);
      updateUser({ ...user, mentorId: null });
      setShowRemoveMentorConfirm(false);
    } catch (error) {
      console.error('Error removing mentor:', error);
      alert('Failed to remove mentor');
    }
  };
  
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Profile</h1>
        <p className="text-gray-600 text-lg">Manage your personal information and preferences</p>
      </div>

      {/* Profile Card */}
      <Card className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-6">
            <Avatar size="xl" initials={user?.name?.split(' ').map(n => n[0]).join('') || 'U'} />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.name || 'User'}</h2>
              <Badge variant="primary" className="mb-3 capitalize">{user?.role || 'learner'}</Badge>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-primary" strokeWidth={2.5} />
                  <span className="font-medium">{user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-teal" strokeWidth={2.5} />
                  <span className="font-medium">Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString('en', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={() => setShowEditModal(true)}>
            <Edit size={18} strokeWidth={2.5} />
            Edit Profile
          </Button>
        </div>

        {user?.role === 'learner' && user?.interests && user.interests.length > 0 && (
          <div className="pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900">Interests</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowPreferencesModal(true)}
              >
                <Settings size={16} strokeWidth={2.5} />
                Edit Preferences
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest, index) => (
                <Badge key={index} variant="purple">{interest}</Badge>
              ))}
            </div>
          </div>
        )}

        {user?.role === 'learner' && user?.learningGoals && user.learningGoals.length > 0 && (
          <div className="pt-6 border-t border-gray-100 mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Learning Goals</h3>
            <div className="flex flex-wrap gap-2">
              {user.learningGoals.map((goal, index) => (
                <Badge key={index} variant="teal">{goal}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Mentor Section - Only for learners */}
        {user?.role === 'learner' && (
          <div className="pt-6 border-t border-gray-100 mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Users size={20} className="text-primary" strokeWidth={2.5} />
                My Mentor
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAssignMentorModal(true)}
              >
                {mentor ? 'Change Mentor' : 'Assign Mentor'}
              </Button>
            </div>
            {mentor ? (
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-lg">
                      {mentor.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{mentor.name}</p>
                      <p className="text-sm text-gray-600">{mentor.email}</p>
                      {mentor.specializations && mentor.specializations.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {mentor.specializations.map((spec, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-danger hover:text-danger hover:bg-danger/10 w-full"
                  onClick={() => setShowRemoveMentorConfirm(true)}
                >
                  Remove Mentor
                </Button>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                <p className="text-gray-500 text-sm">No mentor assigned yet</p>
                <p className="text-gray-400 text-xs mt-1">Get guidance from an experienced mentor</p>
              </div>
            )}
          </div>
        )}

        {/* Mentor Feedback - Only for learners with mentor */}
        {user?.role === 'learner' && user?.mentorId && feedback.length > 0 && (
          <div className="pt-6 border-t border-gray-100 mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <MessageSquare size={20} className="text-primary" strokeWidth={2.5} />
              Mentor Feedback
            </h3>
            <div className="space-y-3">
              {feedback.slice(0, 3).map((item) => (
                <div 
                  key={item._id} 
                  className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/20"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      item.type === 'encouragement' ? 'bg-success/10' :
                      item.type === 'concern' ? 'bg-warning/10' :
                      item.type === 'suggestion' ? 'bg-teal/10' : 'bg-primary/10'
                    }`}>
                      {item.type === 'encouragement' ? (
                        <Heart className="text-success" size={18} strokeWidth={2.5} />
                      ) : (
                        <MessageSquare className={
                          item.type === 'concern' ? 'text-warning' :
                          item.type === 'suggestion' ? 'text-teal' : 'text-primary'
                        } size={18} strokeWidth={2.5} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900 text-sm">{mentor?.name}</p>
                        <Badge variant={
                          item.type === 'encouragement' ? 'success' :
                          item.type === 'concern' ? 'warning' :
                          item.type === 'suggestion' ? 'teal' : 'primary'
                        } className="text-xs capitalize">
                          {item.type}
                        </Badge>
                      </div>
                      <p className="text-gray-700 text-sm">{item.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
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
          </div>
        )}
      </Card>

      {/* Q&A Section - Only for learners with mentor */}
      {user?.role === 'learner' && mentor && (
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
                <MessageSquare className="text-primary" size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Questions & Answers</h2>
                <p className="text-gray-600 text-sm">Ask your mentor anything</p>
              </div>
            </div>
            <Button onClick={() => setShowAskQuestionModal(true)} variant="primary" size="sm">
              Ask Question
            </Button>
          </div>
          
          <QuestionsSection questions={questions} />
        </Card>
      )}

      {/* Mentor Expertise - Only for mentors */}
      {user?.role === 'mentor' && (
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Mentoring Profile</h3>
            <Button variant="outline" size="sm" onClick={() => setShowEditMentorModal(true)}>
              <Settings size={16} strokeWidth={2.5} />
              Edit
            </Button>
          </div>

          {/* Bio */}
          {user?.bio && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">About</h4>
              <p className="text-gray-600">{user.bio}</p>
            </div>
          )}

          {/* Specializations */}
          {user?.specializations && user.specializations.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Specializations</h4>
              <div className="flex flex-wrap gap-2">
                {user.specializations.map((spec, index) => (
                  <Badge key={index} variant="primary">{spec}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl">
              <p className="text-3xl font-bold text-primary mb-1">{user?.maxLearners || 5}</p>
              <p className="text-sm text-gray-600 font-semibold">Max Learners</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-teal/10 to-teal/5 rounded-xl">
              <p className="text-3xl font-bold text-teal mb-1">{user?.specializations?.length || 0}</p>
              <p className="text-sm text-gray-600 font-semibold">Specializations</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple/10 to-purple/5 rounded-xl">
              <p className="text-lg font-bold text-purple mb-1">
                {user?.isAvailableForMentoring ? 'Available' : 'Unavailable'}
              </p>
              <p className="text-sm text-gray-600 font-semibold">Status</p>
            </div>
          </div>

          {/* Availability */}
          {user?.availability && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Availability</h4>
              <p className="text-gray-600">{user.availability}</p>
            </div>
          )}
        </Card>
      )}

      {/* Learning Stats - Only for learners */}
      {user?.role === 'learner' && (
        <Card className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Learning Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
              <p className="text-4xl font-bold text-primary mb-1">{user?.weeklyLearningHoursGoal || 0}</p>
              <p className="text-sm text-gray-600 font-semibold">Weekly Goal (hrs)</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple/10 to-purple/5 rounded-xl border border-purple/20">
              <p className="text-4xl font-bold text-purple mb-1">{user?.experienceLevel || 'N/A'}</p>
              <p className="text-sm text-gray-600 font-semibold">Experience Level</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-teal/10 to-teal/5 rounded-xl border border-teal/20">
              <p className="text-4xl font-bold text-teal mb-1">{user?.interests?.length || 0}</p>
              <p className="text-sm text-gray-600 font-semibold">Interests</p>
            </div>
          </div>
        </Card>
      )}

      {/* Settings */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowPasswordModal(true)}>
              <Lock size={18} strokeWidth={2.5} />
              Change Password
            </Button>
            <Button 
              variant="ghost" 
              className="text-danger hover:text-danger hover:bg-danger/10"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 size={18} strokeWidth={2.5} />
              Delete Account
            </Button>
          </div>
        </div>
      </Card>

      {/* Modals */}
      <EditProfileModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
      />
      <ChangePasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)}
      />
      <DeleteAccountModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
      />
      <EditPreferencesModal 
        isOpen={showPreferencesModal} 
        onClose={() => setShowPreferencesModal(false)}
      />
      <EditMentorProfileModal
        isOpen={showEditMentorModal}
        onClose={() => setShowEditMentorModal(false)}
      />
      <AssignMentorModal
        isOpen={showAssignMentorModal}
        onClose={() => setShowAssignMentorModal(false)}
        currentMentor={mentor}
        onAssigned={handleMentorAssigned}
      />
      <AskQuestionModal
        isOpen={showAskQuestionModal}
        onClose={() => setShowAskQuestionModal(false)}
        onSubmit={handleAskQuestion}
        isLoading={isLoadingQuestion}
      />

      {/* Remove Mentor Confirmation Modal */}
      {showRemoveMentorConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Remove Mentor?</h3>
            <p className="text-gray-600 mb-6">
              Your mentor won't be able to help you with anything or track your progress anymore. You can assign a new mentor anytime.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowRemoveMentorConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleRemoveMentor}
              >
                Remove Mentor
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Ask Question Modal */}
      <AskQuestionModal
        isOpen={showAskQuestionModal}
        onClose={() => setShowAskQuestionModal(false)}
        onSubmit={handleAskQuestion}
        isLoading={isLoadingQuestion}
      />
    </div>
  );
};

export default ProfilePage;
