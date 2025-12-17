import { useState, useEffect } from 'react';
import { Target, BookOpen, TrendingUp, Plus, X } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';

const COMMON_INTERESTS = [
  'Web Development', 'Mobile Development', 'Data Science', 'Machine Learning',
  'AI', 'Cloud Computing', 'DevOps', 'Cybersecurity', 'Blockchain',
  'UI/UX Design', 'Game Development', 'IoT', 'AR/VR', 'Database Management'
];

const COMMON_GOALS = [
  'Land a new job', 'Get a promotion', 'Start freelancing',
  'Build a portfolio', 'Prepare for certifications', 'Learn new technologies',
  'Career transition', 'Personal growth', 'Start a business'
];

const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Beginner', desc: 'Just starting out' },
  { value: 'intermediate', label: 'Intermediate', desc: 'Some experience' },
  { value: 'advanced', label: 'Advanced', desc: 'Seasoned professional' },
  { value: 'expert', label: 'Expert', desc: 'Industry veteran' }
];

const EditPreferencesModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    weeklyLearningHoursGoal: 0,
    experienceLevel: 'beginner',
    interests: [],
    learningGoals: []
  });
  const [newInterest, setNewInterest] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        weeklyLearningHoursGoal: user.weeklyLearningHoursGoal || 5,
        experienceLevel: user.experienceLevel || 'beginner',
        interests: user.interests || [],
        learningGoals: user.learningGoals || []
      });
    }
  }, [isOpen, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axiosClient.patch('/auth/preferences', formData);
      updateUser(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const addInterest = (interest) => {
    if (!formData.interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
    setNewInterest('');
  };

  const removeInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const addGoal = (goal) => {
    if (!formData.learningGoals.includes(goal)) {
      setFormData(prev => ({
        ...prev,
        learningGoals: [...prev.learningGoals, goal]
      }));
    }
    setNewGoal('');
  };

  const removeGoal = (goal) => {
    setFormData(prev => ({
      ...prev,
      learningGoals: prev.learningGoals.filter(g => g !== goal)
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Learning Preferences" size="lg">
      <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
        {error && (
          <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm">
            {error}
          </div>
        )}

        {/* Weekly Hours Goal */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Target size={18} className="inline mr-2" strokeWidth={2.5} />
            Weekly Learning Hours Goal
          </label>
          <Input
            type="number"
            min="1"
            max="100"
            value={formData.weeklyLearningHoursGoal}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              weeklyLearningHoursGoal: parseInt(e.target.value) || 0 
            }))}
            placeholder="Hours per week"
          />
          <p className="text-xs text-gray-500 mt-1">
            Set a realistic goal for your weekly learning time (currently: {formData.weeklyLearningHoursGoal} hours/week)
          </p>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <TrendingUp size={18} className="inline mr-2" strokeWidth={2.5} />
            Overall Experience Level
          </label>
          <p className="text-xs text-gray-500 mb-3">
            This represents your overall career stage, not expertise in specific skills
          </p>
          <div className="grid grid-cols-2 gap-3">
            {EXPERIENCE_LEVELS.map(level => (
              <button
                key={level.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, experienceLevel: level.value }))}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  formData.experienceLevel === level.value
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="font-bold text-gray-900">{level.label}</div>
                <div className="text-xs text-gray-600 mt-1">{level.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <BookOpen size={18} className="inline mr-2" strokeWidth={2.5} />
            Learning Interests
          </label>
          
          {/* Current Interests */}
          {formData.interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.interests.map((interest, idx) => (
                <Badge key={idx} variant="purple" className="gap-2">
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeInterest(interest)}
                    className="hover:text-danger transition-colors"
                  >
                    <X size={14} strokeWidth={2.5} />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Add Custom Interest */}
          <div className="flex gap-2 mb-3">
            <Input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add custom interest..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (newInterest.trim()) addInterest(newInterest.trim());
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => newInterest.trim() && addInterest(newInterest.trim())}
            >
              <Plus size={18} strokeWidth={2.5} />
            </Button>
          </div>

          {/* Common Interests */}
          <div className="flex flex-wrap gap-2">
            {COMMON_INTERESTS.filter(i => !formData.interests.includes(i)).map((interest, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => addInterest(interest)}
                className="px-3 py-1 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-gray-700 transition-colors"
              >
                + {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Learning Goals */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Target size={18} className="inline mr-2" strokeWidth={2.5} />
            Learning Goals
          </label>
          
          {/* Current Goals */}
          {formData.learningGoals.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.learningGoals.map((goal, idx) => (
                <Badge key={idx} variant="teal" className="gap-2">
                  {goal}
                  <button
                    type="button"
                    onClick={() => removeGoal(goal)}
                    className="hover:text-danger transition-colors"
                  >
                    <X size={14} strokeWidth={2.5} />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Add Custom Goal */}
          <div className="flex gap-2 mb-3">
            <Input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Add custom goal..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (newGoal.trim()) addGoal(newGoal.trim());
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => newGoal.trim() && addGoal(newGoal.trim())}
            >
              <Plus size={18} strokeWidth={2.5} />
            </Button>
          </div>

          {/* Common Goals */}
          <div className="flex flex-wrap gap-2">
            {COMMON_GOALS.filter(g => !formData.learningGoals.includes(g)).map((goal, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => addGoal(goal)}
                className="px-3 py-1 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-gray-700 transition-colors"
              >
                + {goal}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditPreferencesModal;
