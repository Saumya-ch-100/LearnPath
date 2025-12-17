import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Target, BookOpen, Clock, TrendingUp, MessageSquare, Send } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import ReplyQuestionModal from '../../components/modals/ReplyQuestionModal';

const LearnerProgressPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('feedback');
  const [sending, setSending] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchLearnerProgress();
    fetchQuestions();
  }, [id]);

  const fetchLearnerProgress = async () => {
    try {
      const response = await axiosClient.get(`/learners/${id}/progress`);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching learner progress:', error);
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axiosClient.get(`/questions/learner/${id}`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleSendFeedback = async () => {
    if (!feedbackMessage.trim()) return;
    
    setSending(true);
    try {
      await axiosClient.post(`/learners/${id}/feedback`, {
        message: feedbackMessage,
        type: feedbackType,
      });
      
      setFeedbackMessage('');
      setShowFeedbackModal(false);
      fetchLearnerProgress(); // Refresh to show new feedback
      alert('Feedback sent successfully!');
    } catch (error) {
      console.error('Error sending feedback:', error);
      alert('Failed to send feedback');
    } finally {
      setSending(false);
    }
  };

  const handleReplyToQuestion = async (reply) => {
    setSendingReply(true);
    try {
      await axiosClient.post(`/questions/${selectedQuestion._id}/answer`, { reply });
      await fetchQuestions();
      setShowReplyModal(false);
      setSelectedQuestion(null);
      alert('Answer sent successfully!');
    } catch (error) {
      console.error('Error replying to question:', error);
      alert('Failed to send answer');
    } finally {
      setSendingReply(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Spinner size="lg" />
        <p className="text-gray-500 font-medium">Loading learner progress...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500">Learner not found</div>
      </div>
    );
  }

  const { learner, skills, recentLogs, milestones, stats, feedback } = data;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate('/mentor')}>
          <ArrowLeft size={20} className="mr-2" strokeWidth={2.5} />
          Back to Learners
        </Button>
        <Button onClick={() => setShowFeedbackModal(true)}>
          <MessageSquare size={18} className="mr-2" strokeWidth={2.5} />
          Leave Feedback
        </Button>
      </div>

      {/* Learner Info */}
      <Card className="p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-3xl">
            {learner.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{learner.name}</h1>
            <p className="text-gray-600 mt-1">{learner.headline}</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail size={16} />
                {learner.email}
              </div>
              {learner.experienceLevel && (
                <Badge variant="primary">{learner.experienceLevel}</Badge>
              )}
            </div>
            {learner.bio && (
              <p className="text-gray-600 mt-3">{learner.bio}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Skills</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalSkills}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl">
              <Target className="text-primary" size={24} strokeWidth={2.5} />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Learning Logs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalLogs}</p>
            </div>
            <div className="p-3 bg-teal/10 rounded-xl">
              <BookOpen className="text-teal" size={24} strokeWidth={2.5} />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalHours}h</p>
            </div>
            <div className="p-3 bg-warning/10 rounded-xl">
              <Clock className="text-warning" size={24} strokeWidth={2.5} />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Milestones</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.completedMilestones}/{stats.totalMilestones}
              </p>
            </div>
            <div className="p-3 bg-success/10 rounded-xl">
              <TrendingUp className="text-success" size={24} strokeWidth={2.5} />
            </div>
          </div>
        </Card>
      </div>

      {/* Skills */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
        {skills.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No skills yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((userSkill) => (
              <div key={userSkill._id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{userSkill.skillId?.name}</h3>
                  <Badge variant="secondary" className="text-xs">{userSkill.skillId?.category}</Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current:</span>
                    <span className="font-medium">Level {userSkill.currentLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Target:</span>
                    <span className="font-medium">Level {userSkill.targetLevel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Logs */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Learning Logs</h2>
          {recentLogs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No logs yet</p>
          ) : (
            <div className="space-y-3">
              {recentLogs.slice(0, 5).map((log) => (
                <div key={log._id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium text-gray-900">{log.skillId?.name}</p>
                    <p className="text-sm text-gray-500">{new Date(log.date).toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm text-gray-600">{log.notes}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round(log.durationMinutes / 60 * 10) / 10}h
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Milestones */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Milestones</h2>
          {milestones.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No milestones yet</p>
          ) : (
            <div className="space-y-3">
              {milestones.map((milestone) => (
                <div key={milestone._id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium text-gray-900">{milestone.title}</p>
                    {milestone.status === 'completed' ? (
                      <Badge variant="success" className="text-xs">Completed</Badge>
                    ) : new Date(milestone.targetDate) < new Date() ? (
                      <Badge variant="danger" className="text-xs">Overdue</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">In Progress</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{milestone.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Target: {new Date(milestone.targetDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Questions from Learner */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="text-teal" size={22} strokeWidth={2.5} />
          Questions from {learner.name}
        </h2>
        {questions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No questions yet</p>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${q.isAnswered ? 'bg-green-100' : 'bg-yellow-100'}`}>
                    {q.isAnswered ? (
                      <MessageSquare className="text-success" size={18} strokeWidth={2.5} />
                    ) : (
                      <MessageSquare className="text-warning" size={18} strokeWidth={2.5} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={q.isAnswered ? 'success' : 'warning'} className="text-xs">
                        {q.isAnswered ? 'Answered' : 'Pending'}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(q.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium mb-1">Question:</p>
                    <p className="text-gray-700">{q.question}</p>
                    
                    {q.isAnswered && q.reply && (
                      <div className="mt-3 pl-4 border-l-2 border-primary">
                        <p className="text-sm font-semibold text-primary mb-1">Your Answer:</p>
                        <p className="text-gray-700">{q.reply}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(q.answeredAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    {!q.isAnswered && (
                      <Button
                        onClick={() => {
                          setSelectedQuestion(q);
                          setShowReplyModal(true);
                        }}
                        variant="primary"
                        size="sm"
                        className="mt-3"
                      >
                        Reply
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Feedback History */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MessageSquare className="text-primary" size={22} strokeWidth={2.5} />
          Feedback History
        </h2>
        {!feedback || feedback.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No feedback given yet</p>
        ) : (
          <div className="space-y-3">
            {feedback.map((item) => (
              <div key={item._id} className="p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-xl border border-primary/20">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      item.type === 'encouragement' ? 'success' :
                      item.type === 'concern' ? 'warning' :
                      item.type === 'suggestion' ? 'teal' : 'primary'
                    } className="text-xs capitalize">
                      {item.type}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString('en', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-gray-900">{item.message}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-slide-up">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="text-primary" size={22} strokeWidth={2.5} />
              Leave Feedback for {learner.name}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
              <div className="grid grid-cols-4 gap-2">
                {['feedback', 'encouragement', 'suggestion', 'concern'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFeedbackType(type)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                      feedbackType === type
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
              <textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder="Share your thoughts, encouragement, or suggestions..."
                rows={5}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowFeedbackModal(false);
                  setFeedbackMessage('');
                  setFeedbackType('feedback');
                }}
                disabled={sending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendFeedback}
                disabled={!feedbackMessage.trim() || sending}
              >
                <Send size={16} className="mr-2" strokeWidth={2.5} />
                {sending ? 'Sending...' : 'Send Feedback'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Question Modal */}
      <ReplyQuestionModal
        isOpen={showReplyModal}
        onClose={() => {
          setShowReplyModal(false);
          setSelectedQuestion(null);
        }}
        onSubmit={handleReplyToQuestion}
        question={selectedQuestion}
        isLoading={sendingReply}
      />
    </div>
  );
};

export default LearnerProgressPage;
