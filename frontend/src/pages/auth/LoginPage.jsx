import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData);
    
    if (result.success) {
      if (result.needsOnboarding) {
        navigate('/onboarding');
      } else {
        // Redirect based on user role
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else if (result.user.role === 'mentor') {
          navigate('/mentor');
        } else {
          navigate('/dashboard');
        }
      }
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text mb-3">Welcome back 👋</h2>
        <p className="text-gray-600">Sign in to continue your learning journey</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 flex items-start gap-3">
          <AlertCircle className="text-danger shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-danger font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          icon={<Mail size={18} />}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={<Lock size={18} />}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        <Button type="submit" className="w-full mt-6" size="lg" disabled={loading}>
          {loading ? (
            <>Loading...</>
          ) : (
            <>
              <LogIn size={20} />
              Sign In
            </>
          )}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:text-primary-600 font-semibold transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
