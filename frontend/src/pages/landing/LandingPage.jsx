import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Target, 
  Users, 
  TrendingUp, 
  Zap, 
  BookOpen, 
  MessageSquare,
  Award,
  ArrowRight,
  Check,
  Sparkles,
  BarChart3
} from 'lucide-react';

const LandingPage = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: Target,
      title: 'Personalized Learning Paths',
      description: 'Create custom learning journeys tailored to your goals and skill level',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Users,
      title: 'Expert Mentorship',
      description: 'Connect with experienced mentors for guidance and real-time feedback',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
    },
    {
      icon: BarChart3,
      title: 'Visual Progress Tracking',
      description: 'Monitor your growth with beautiful charts and analytics dashboards',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: MessageSquare,
      title: 'Q&A Platform',
      description: 'Ask questions and get personalized answers from your mentor anytime',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Award,
      title: 'Milestone Management',
      description: 'Set and track learning milestones with smart reminders and notifications',
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50',
    },
    {
      icon: Zap,
      title: 'Streak Tracking',
      description: 'Build consistent learning habits with daily streak counters and rewards',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Active Learners' },
    { number: '500+', label: 'Expert Mentors' },
    { number: '1000+', label: 'Learning Resources' },
    { number: '95%', label: 'Success Rate' },
  ];

  const roles = [
    {
      title: 'For Learners',
      icon: BookOpen,
      color: 'blue',
      features: [
        'Personalized learning paths',
        'Progress tracking & analytics',
        'Connect with expert mentors',
        'Q&A with instant responses',
        'Milestone & reminder system',
        'Learning streak rewards',
      ],
    },
    {
      title: 'For Mentors',
      icon: Users,
      color: 'purple',
      features: [
        'Manage multiple learners',
        'Provide structured feedback',
        'Answer learner questions',
        'Track learner progress',
        'View detailed analytics',
        'Help shape learning paths',
      ],
    },
    {
      title: 'For Admins',
      icon: Award,
      color: 'green',
      features: [
        'User management dashboard',
        'Skill catalog maintenance',
        'Resource curation',
        'Platform analytics',
        'Content moderation',
        'System configuration',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-blue-600 rounded-xl">
                <GraduationCap className="text-white" size={28} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold gradient-text">LearnPath</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="px-6 py-2.5 text-gray-700 hover:text-primary font-semibold transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-primary to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-primary rounded-full mb-6 animate-fade-in">
              <Sparkles size={16} strokeWidth={2.5} />
              <span className="text-sm font-semibold">The Future of Learning is Here</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Learn Smarter,
              <br />
              <span className="gradient-text">Grow Faster</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Transform your learning journey with AI-powered mentorship, personalized paths,
              and real-time progress tracking. Join thousands of learners achieving their goals.
            </p>
            
            <div className="flex items-center justify-center gap-4 mb-12">
              <Link
                to="/register"
                className="group px-8 py-4 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
              >
                Start Learning Free
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} strokeWidth={2.5} />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-primary hover:text-primary transition-all"
              >
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all">
                  <div className="text-4xl font-bold gradient-text mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-full mb-4">
              <Zap size={16} strokeWidth={2.5} />
              <span className="text-sm font-semibold">Powerful Features</span>
            </div>
            <h2 className="text-5xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools designed to accelerate your learning and help you reach your goals faster.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group p-8 rounded-2xl border-2 border-gray-200 hover:border-transparent hover:shadow-2xl transition-all cursor-pointer ${
                  hoveredFeature === index ? feature.bgColor : 'bg-white'
                }`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`p-4 bg-gradient-to-br ${feature.color} rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="text-white" size={28} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-600 rounded-full mb-4">
              <Users size={16} strokeWidth={2.5} />
              <span className="text-sm font-semibold">Built for Everyone</span>
            </div>
            <h2 className="text-5xl font-bold mb-4">Choose Your Path</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you're learning, teaching, or managing, LearnPath has the perfect tools for you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <div
                key={index}
                className="p-8 bg-white rounded-2xl border-2 border-gray-200 hover:shadow-2xl hover:scale-105 transition-all"
              >
                <div className={`p-4 bg-${role.color}-100 rounded-xl w-fit mb-6`}>
                  <role.icon className={`text-${role.color}-600`} size={32} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{role.title}</h3>
                <ul className="space-y-3">
                  {role.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="text-success flex-shrink-0 mt-0.5" size={20} strokeWidth={2.5} />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-12 bg-gradient-to-br from-primary to-blue-600 rounded-3xl text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10"></div>
            <div className="relative z-10">
              <h2 className="text-5xl font-bold mb-6">Ready to Transform Your Learning?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of learners who are already achieving their goals with LearnPath.
                Start your journey today—completely free.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                Get Started Free
                <ArrowRight size={20} strokeWidth={2.5} />
              </Link>
              <p className="mt-6 text-blue-100 text-sm">
                No credit card required • Free forever • Get started in 30 seconds
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-primary to-blue-600 rounded-xl">
              <GraduationCap className="text-white" size={24} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold">LearnPath</span>
          </div>
          <p className="text-gray-400 mb-8">
            Empowering learners worldwide with personalized education and expert mentorship.
          </p>
          <div className="flex items-center justify-center gap-8 text-gray-400 text-sm">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <a href="mailto:hello@learnpath.com" className="hover:text-white transition-colors">Contact Us</a>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-gray-500 text-sm">
            <p>© 2025 LearnPath. Made with ❤️ and ☕</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
