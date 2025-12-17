import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, Clock, ChevronRight, Check } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';

const SPECIALIZATION_OPTIONS = [
  'Frontend Development',
  'Backend Development',
  'Full-Stack Development',
  'Mobile Development',
  'DevOps',
  'Cloud Computing',
  'Data Science',
  'Machine Learning',
  'UI/UX Design',
  'Cybersecurity',
  'Database Design',
  'System Architecture',
  'React',
  'Node.js',
  'Python',
  'Java',
  'JavaScript',
  'TypeScript',
  'AWS',
  'Docker',
];

const AVAILABILITY_OPTIONS = [
  'Weekday mornings',
  'Weekday afternoons',
  'Weekday evenings',
  'Weekends only',
  'Flexible schedule',
  'Prefer async communication',
];

const MentorOnboardingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    specializations: [],
    availability: '',
    maxLearners: 5,
    isAvailableForMentoring: true,
  });

  const handleSpecializationToggle = (spec) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter(s => s !== spec)
        : [...prev.specializations, spec],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.post('/onboarding/complete', formData);
      
      // Update user in context
      const updatedUser = { ...user, ...response.data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      navigate('/mentor');
    } catch (error) {
      console.error('Onboarding error:', error);
      alert(error.response?.data?.message || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return formData.bio.trim().length > 20;
    if (step === 2) return formData.specializations.length > 0;
    if (step === 3) return formData.availability !== '';
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-teal/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <Card className="w-full max-w-2xl p-8 relative z-10 bg-white/95 backdrop-blur">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-teal mb-4">
            <GraduationCap className="text-white" size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Welcome, Mentor! 🎓</h1>
          <p className="text-gray-600">Let's set up your mentoring profile</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  s < step
                    ? 'bg-success text-white'
                    : s === step
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {s < step ? <Check size={20} strokeWidth={2.5} /> : s}
              </div>
              {s < 4 && (
                <div
                  className={`w-12 h-1 mx-1 rounded-full ${
                    s < step ? 'bg-success' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Bio */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about yourself</h2>
              <p className="text-gray-600">Share your experience and what you're passionate about</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Bio *</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="e.g., Full-stack developer with 10+ years of experience in web technologies. Passionate about helping learners grow and succeed..."
                rows={5}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary/30 focus:border-primary focus:outline-none transition-all resize-none"
              />
              <p className="text-xs text-gray-500">
                {formData.bio.length} / 20 minimum characters
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Specializations */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your expertise</h2>
              <p className="text-gray-600">Select the areas you can mentor learners in</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
              {SPECIALIZATION_OPTIONS.map((spec) => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => handleSpecializationToggle(spec)}
                  className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                    formData.specializations.includes(spec)
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-500 text-center">
              Selected: {formData.specializations.length}
            </p>
          </div>
        )}

        {/* Step 3: Availability */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">When are you available?</h2>
              <p className="text-gray-600">Let learners know your preferred mentoring times</p>
            </div>

            <div className="space-y-3">
              {AVAILABILITY_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFormData({ ...formData, availability: option })}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    formData.availability === option
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{option}</span>
                    {formData.availability === option && (
                      <Check className="text-primary" size={20} strokeWidth={2.5} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Capacity */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Learner capacity</h2>
              <p className="text-gray-600">How many learners can you mentor at once?</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Maximum number of learners
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={formData.maxLearners}
                  onChange={(e) => setFormData({ ...formData, maxLearners: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>1</span>
                  <span className="text-2xl font-bold text-primary">{formData.maxLearners}</span>
                  <span>20</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <Users className="text-teal mt-1" size={20} strokeWidth={2.5} />
                  <div>
                    <p className="font-medium text-gray-900 mb-1">You're accepting learners</p>
                    <p className="text-sm text-gray-600">
                      Learners will be able to see your profile and request mentorship. You can change this
                      setting anytime from your profile.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <Button
            variant="ghost"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            Back
          </Button>

          <div className="flex items-center gap-3">
            {step < 4 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
              >
                Continue
                <ChevronRight size={18} strokeWidth={2.5} />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
              >
                {loading ? 'Completing...' : 'Complete Setup'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MentorOnboardingPage;
