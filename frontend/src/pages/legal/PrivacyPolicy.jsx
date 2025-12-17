import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Eye, Lock, Database, UserCheck } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl mb-4">
            <Shield className="text-white" size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: December 14, 2025</p>
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              At LearnPath, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our B2B2C learning platform 
              designed for educational institutions.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="text-primary" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Name, email address, and profile information</li>
                  <li>Learning goals, skill levels, and progress data</li>
                  <li>Questions asked and answers received from mentors</li>
                  <li>Learning resources accessed and time spent</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Institutional Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Institution name, domain, and administrative contacts</li>
                  <li>User roles and permissions within your organization</li>
                  <li>Aggregated usage statistics and analytics</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Technical Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>IP address, browser type, and device information</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Log data and usage patterns</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Database className="text-purple-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
            </div>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>To provide and maintain our learning platform services</li>
              <li>To personalize your learning experience and recommendations</li>
              <li>To facilitate mentor-learner interactions and Q&A features</li>
              <li>To track your progress and generate analytics dashboards</li>
              <li>To communicate updates, notifications, and support messages</li>
              <li>To improve our services through usage analysis</li>
              <li>To ensure platform security and prevent fraud</li>
              <li>To comply with legal obligations and institutional requirements</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Lock className="text-green-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>JWT-based authentication with secure token management</li>
                <li>Password hashing using bcrypt encryption</li>
                <li>Role-based access control (learner/mentor/admin)</li>
                <li>HTTPS encryption for all data transmission</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Secure MongoDB database with access restrictions</li>
              </ul>
              <p className="text-sm italic mt-4">
                However, no method of transmission over the internet is 100% secure. While we strive 
                to protect your data, we cannot guarantee absolute security.
              </p>
            </div>
          </section>

          {/* Data Sharing */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <UserCheck className="text-orange-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Data Sharing & Disclosure</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>We may share your information with:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Your Institution:</strong> Progress data, completion rates, and analytics as per your institutional agreement</li>
                <li><strong>Your Mentors:</strong> Learning progress, questions, and relevant profile information to facilitate mentorship</li>
                <li><strong>Service Providers:</strong> Third-party services that help us operate the platform (hosting, analytics, etc.)</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental authority</li>
              </ul>
              <p className="font-semibold mt-4">
                We do NOT sell your personal information to third parties.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Privacy Rights</h2>
            <div className="space-y-2 text-gray-700">
              <p>Depending on your location, you may have the following rights:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your data (subject to institutional policies)</li>
                <li><strong>Export:</strong> Download your learning data in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, contact your institution's administrator or email us at{' '}
                <a href="mailto:privacy@learnpath.com" className="text-primary font-semibold hover:underline">
                  privacy@learnpath.com
                </a>
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies & Tracking</h2>
            <p className="text-gray-700">
              We use cookies and similar technologies to enhance your experience, analyze usage, and 
              maintain your session. You can control cookie preferences through your browser settings, 
              but disabling cookies may limit platform functionality.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-700">
              LearnPath is designed for institutional use. If your institution serves users under 13, 
              they must obtain appropriate parental consent. We do not knowingly collect data from 
              children without institutional authorization.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy periodically. We will notify institutions and users 
              of significant changes via email or platform notification. Continued use after changes 
              constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-3">
              If you have questions about this Privacy Policy or our data practices:
            </p>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:privacy@learnpath.com" className="text-primary font-semibold hover:underline">
                  privacy@learnpath.com
                </a>
              </p>
              <p>
                <strong>General Inquiries:</strong>{' '}
                <a href="mailto:hello@learnpath.com" className="text-primary font-semibold hover:underline">
                  hello@learnpath.com
                </a>
              </p>
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <span>•</span>
            <a href="mailto:hello@learnpath.com" className="hover:text-primary transition-colors">Contact Us</a>
            <span>•</span>
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
