import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Target, TrendingUp, Zap, ChevronRight, Check } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';

const INTEREST_OPTIONS = [
  { id: 'web-dev', label: 'Web Development', icon: '🌐' },
  { id: 'mobile-dev', label: 'Mobile Development', icon: '📱' },
  { id: 'data-science', label: 'Data Science', icon: '📊' },
  { id: 'machine-learning', label: 'Machine Learning', icon: '🤖' },
  { id: 'devops', label: 'DevOps', icon: '⚙️' },
  { id: 'cloud', label: 'Cloud Computing', icon: '☁️' },
  { id: 'cybersecurity', label: 'Cybersecurity', icon: '🔒' },
  { id: 'ui-ux', label: 'UI/UX Design', icon: '🎨' },
  { id: 'blockchain', label: 'Blockchain', icon: '⛓️' },
  { id: 'game-dev', label: 'Game Development', icon: '🎮' },
];

const GOAL_OPTIONS = [
  'Land a new job',
  'Get promoted',
  'Build side projects',
  'Start freelancing',
  'Learn new technologies',
  'Prepare for certifications',
  'Career change',
  'Personal growth',
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    interests: [],
    learningGoals: [],
    weeklyLearningHoursGoal: 5,
    experienceLevel: '',
  });

  const handleInterestToggle = (interestId) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId],
    }));
  };

  const handleGoalToggle = (goal) => {
    setFormData(prev => ({
      ...prev,
      learningGoals: prev.learningGoals.includes(goal)
        ? prev.learningGoals.filter(g => g !== goal)
        : [...prev.learningGoals, goal],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.post('/onboarding/complete', formData);
      
      // Update user in context
      const updatedUser = { ...user, ...response.data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      alert(error.response?.data?.message || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    try {
      await axiosClient.post('/onboarding/skip');
      navigate('/dashboard');
    } catch (error) {
      console.error('Skip error:', error);
    }
  };

  const canProceed = () => {
    if (step === 1) return formData.interests.length > 0;
    if (step === 2) return formData.learningGoals.length > 0;
    if (step === 3) return formData.experienceLevel !== '';
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-teal/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple/10 rounded-full blur-3xl" />

      <div className="w-full max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-purple mb-4 shadow-xl">
            <Sparkles size={36} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-5xl font-bold gradient-text mb-3">
            Welcome to LearnPath, {user?.name?.split(' ')[0]}! ✨
          </h1>
          <p className="text-gray-600 text-lg">Let's personalize your learning journey</p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                s <= step ? 'w-16 bg-gradient-to-r from-primary to-teal' : 'w-8 bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Interests */}
        {step === 1 && (
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
                <Target className="text-primary" size={28} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">What interests you?</h2>
                <p className="text-gray-600 text-sm">Select all that apply (choose at least one)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {INTEREST_OPTIONS.map((interest) => (
                <button
                  key={interest.id}
                  onClick={() => handleInterestToggle(interest.id)}
                  className={`p-4 rounded-2xl border-2 transition-all hover:scale-105 ${
                    formData.interests.includes(interest.id)
                      ? 'border-primary bg-primary/10 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-3xl mb-2">{interest.icon}</div>
                  <p className="text-gray-900 font-semibold text-sm">{interest.label}</p>
                  {formData.interests.includes(interest.id) && (
                    <Check className="text-primary mx-auto mt-2" size={20} strokeWidth={2.5} />
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={handleSkip}>Skip for now</Button>
              <Button
                onClick={() => setStep(2)}
                disabled={!canProceed()}
                className="gap-2"
              >
                Next <ChevronRight size={20} />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Goals */}
        {step === 2 && (
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-teal/20 to-teal/10 border border-teal/20">
                <TrendingUp className="text-teal-600" size={28} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">What are your goals?</h2>
                <p className="text-gray-600 text-sm">Select your learning objectives</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {GOAL_OPTIONS.map((goal) => (
                <button
                  key={goal}
                  onClick={() => handleGoalToggle(goal)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all hover:scale-105 ${
                    formData.learningGoals.includes(goal)
                      ? 'border-teal bg-teal/10 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900 font-semibold">{goal}</p>
                    {formData.learningGoals.includes(goal) && (
                      <Check className="text-teal-600" size={20} strokeWidth={2.5} />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!canProceed()}
                className="gap-2"
              >
                Next <ChevronRight size={20} />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Experience Level */}
        {step === 3 && (
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple/20 to-purple/10 border border-purple/20">
                <Zap className="text-purple" size={28} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">What's your experience level?</h2>
                <p className="text-gray-600 text-sm">This helps us recommend the right resources</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { value: 'beginner', label: 'Beginner', desc: 'Just starting my learning journey', icon: '🌱' },
                { value: 'intermediate', label: 'Intermediate', desc: 'Have some experience, ready to level up', icon: '🚀' },
                { value: 'advanced', label: 'Advanced', desc: 'Experienced, looking to master new skills', icon: '⚡' },
              ].map((level) => (
                <button
                  key={level.value}
                  onClick={() => setFormData(prev => ({ ...prev, experienceLevel: level.value }))}
                  className={`w-full p-6 rounded-2xl border-2 text-left transition-all hover:scale-102 ${
                    formData.experienceLevel === level.value
                      ? 'border-purple bg-purple/10 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{level.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{level.label}</h3>
                      <p className="text-gray-600 text-sm">{level.desc}</p>
                    </div>
                    {formData.experienceLevel === level.value && (
                      <Check className="text-purple" size={24} strokeWidth={2.5} />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
              <Button
                onClick={() => setStep(4)}
                disabled={!canProceed()}
                className="gap-2"
              >
                Next <ChevronRight size={20} />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 4: Weekly Goal */}
        {step === 4 && (
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-orange/20 to-orange/10 border border-orange/20">
                <Target className="text-orange" size={28} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Set your weekly goal</h2>
                <p className="text-gray-600 text-sm">How many hours do you want to learn per week?</p>
              </div>
            </div>

            <div className="text-center py-8">
              <div className="text-8xl font-bold gradient-text mb-4">
                {formData.weeklyLearningHoursGoal}
              </div>
              <p className="text-gray-600 text-lg font-medium mb-8">hours per week</p>

              <input
                type="range"
                min="1"
                max="40"
                value={formData.weeklyLearningHoursGoal}
                onChange={(e) => setFormData(prev => ({ ...prev, weeklyLearningHoursGoal: parseInt(e.target.value) }))}
                className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-primary [&::-webkit-slider-thumb]:to-orange [&::-webkit-slider-thumb]:shadow-xl"
              />

              <div className="flex justify-between text-sm text-gray-500 font-medium mt-3">
                <span>1h</span>
                <span>20h</span>
                <span>40h</span>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={() => setStep(3)}>Back</Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="gap-2"
                variant="success"
              >
                {loading ? 'Completing...' : (
                  <>
                    <Check size={20} />
                    Complete Setup
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
