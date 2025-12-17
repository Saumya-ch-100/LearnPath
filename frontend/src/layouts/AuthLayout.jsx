import { Outlet } from 'react-router-dom';
import { GraduationCap, Sparkles } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple/5 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Auth Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
          {/* Logo & Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-teal mb-4 shadow-lg">
              <GraduationCap size={36} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold gradient-text mb-3 flex items-center justify-center gap-2">
              LearnPath
              <Sparkles size={20} className="text-orange" />
            </h1>
            <p className="text-gray-600">
              Your personalized learning companion
            </p>
          </div>

          {/* Auth Form Content */}
          <Outlet />

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              © 2025 LearnPath. Built for lifelong learners.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
