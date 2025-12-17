import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, AlertCircle, GraduationCap, Target } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'prefer-not-to-say',
    role: 'learner',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    
    if (result.success) {
      // New users always go to onboarding
      navigate('/onboarding');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text mb-3">Create an account ✨</h2>
        <p className="text-gray-600">Start your personalized learning journey today</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 flex items-start gap-3">
          <AlertCircle className="text-danger shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-danger font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Role Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">I want to join as</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'learner' })}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                formData.role === 'learner'
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Target className={`mb-2 ${
                formData.role === 'learner' ? 'text-primary' : 'text-gray-400'
              }`} size={24} strokeWidth={2.5} />
              <h4 className="font-semibold text-gray-900 mb-1">Learner</h4>
              <p className="text-xs text-gray-600">Track skills and learn with mentors</p>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'mentor' })}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                formData.role === 'mentor'
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <GraduationCap className={`mb-2 ${
                formData.role === 'mentor' ? 'text-primary' : 'text-gray-400'
              }`} size={24} strokeWidth={2.5} />
              <h4 className="font-semibold text-gray-900 mb-1">Mentor</h4>
              <p className="text-xs text-gray-600">Guide and support learners</p>
            </button>
          </div>
        </div>

        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          icon={<User size={18} />}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          icon={<Mail size={18} />}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary/30 focus:border-primary focus:outline-none transition-all"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={<Lock size={18} />}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          icon={<Lock size={18} />}
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
        />

        <Button type="submit" className="w-full mt-6" size="lg" disabled={loading}>
          {loading ? (
            <>Creating Account...</>
          ) : (
            <>
              <UserPlus size={20} />
              Create Account
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary-600 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
