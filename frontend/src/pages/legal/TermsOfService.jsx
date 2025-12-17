import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, AlertCircle, CheckCircle, XCircle, Scale } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4">
            <FileText className="text-white" size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: December 14, 2025</p>
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              Welcome to LearnPath! These Terms of Service ("Terms") govern your access to and use of 
              the LearnPath learning platform. By accessing or using LearnPath, you agree to be bound 
              by these Terms. If you disagree with any part of these Terms, you may not access the platform.
            </p>
            <div className="mt-4 p-4 bg-blue-50 border-l-4 border-primary rounded">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> LearnPath is a B2B2C platform. These Terms apply to both 
                institutional clients and end-users (learners, mentors, admins).
              </p>
            </div>
          </section>

          {/* Acceptance of Terms */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>By using LearnPath, you confirm that:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>You are authorized by your institution to use this platform</li>
                <li>You are at least 13 years old (or have parental/institutional consent)</li>
                <li>You will comply with all applicable laws and regulations</li>
                <li>The information you provide is accurate and up-to-date</li>
                <li>You will not misuse the platform or violate these Terms</li>
              </ul>
            </div>
          </section>

          {/* Account Responsibilities */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Scale className="text-purple-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">2. Account Responsibilities</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <h3 className="font-semibold text-gray-900">Account Creation & Security</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Your account is created and managed by your institution</li>
                <li>You are responsible for maintaining the confidentiality of your credentials</li>
                <li>You must notify your admin immediately of any unauthorized access</li>
                <li>You are responsible for all activities under your account</li>
                <li>Sharing accounts is strictly prohibited</li>
              </ul>
              
              <h3 className="font-semibold text-gray-900 mt-4">User Roles</h3>
              <p>LearnPath supports three user roles:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Learners:</strong> Track skills, access resources, ask questions, monitor progress</li>
                <li><strong>Mentors:</strong> Guide learners, answer questions, review progress, provide feedback</li>
                <li><strong>Admins:</strong> Manage users, resources, skill taxonomies, and platform settings</li>
              </ul>
            </div>
          </section>

          {/* Platform Usage */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="text-primary" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">3. Acceptable Use</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>You agree to use LearnPath for legitimate educational purposes only. You may:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-green-700">
                <li>Create and track personalized learning paths</li>
                <li>Access curated learning resources</li>
                <li>Log learning hours and monitor progress</li>
                <li>Set milestones and receive reminders</li>
                <li>Communicate with mentors through the Q&A platform</li>
                <li>Share progress with authorized mentors and peers</li>
                <li>Participate in community challenges and leaderboards</li>
              </ul>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="text-red-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">4. Prohibited Activities</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>You agree NOT to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-red-700">
                <li>Violate any laws, regulations, or third-party rights</li>
                <li>Impersonate others or provide false information</li>
                <li>Upload malicious code, viruses, or harmful content</li>
                <li>Attempt to gain unauthorized access to the platform or other accounts</li>
                <li>Scrape, copy, or reverse-engineer the platform</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Post spam, advertisements, or inappropriate content</li>
                <li>Circumvent security features or access restrictions</li>
                <li>Use the platform for commercial purposes without authorization</li>
                <li>Share or sell your account credentials</li>
              </ul>
              <p className="font-semibold mt-4">
                Violations may result in account suspension or termination without notice.
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property</h2>
            <div className="space-y-3 text-gray-700">
              <h3 className="font-semibold text-gray-900">LearnPath's IP</h3>
              <p>
                All content, features, and functionality of LearnPath (including but not limited to 
                text, graphics, logos, icons, images, audio clips, video, data compilations, software, 
                and the compilation thereof) are owned by LearnPath or its licensors and are protected 
                by international copyright, trademark, patent, and other intellectual property laws.
              </p>
              
              <h3 className="font-semibold text-gray-900 mt-4">Your Content</h3>
              <p>
                You retain ownership of content you create (questions, learning logs, notes, etc.). 
                By using LearnPath, you grant us a license to use, store, and display your content 
                for the purpose of providing the service. Your institution may also have access to 
                your content as per your institutional agreement.
              </p>
              
              <h3 className="font-semibold text-gray-900 mt-4">Learning Resources</h3>
              <p>
                Learning resources (courses, tutorials, books) may be owned by third parties. You must 
                respect the intellectual property rights of resource creators and use them only as permitted.
              </p>
            </div>
          </section>

          {/* Data & Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data & Privacy</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Your privacy is important to us. Our collection and use of your data is governed by our{' '}
                <Link to="/privacy" className="text-primary font-semibold hover:underline">
                  Privacy Policy
                </Link>
                , which is incorporated into these Terms by reference.
              </p>
              <p>
                Key points:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>We collect personal and learning data to provide our services</li>
                <li>Your institution has access to your progress and analytics</li>
                <li>We use industry-standard security measures to protect your data</li>
                <li>We do not sell your personal information to third parties</li>
              </ul>
            </div>
          </section>

          {/* Institutional Clients */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Institutional Clients</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                If you're an institution using LearnPath:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>You are responsible for managing user accounts and access</li>
                <li>You must ensure users comply with these Terms</li>
                <li>You own your institutional data and can export it at any time</li>
                <li>Pricing, billing, and support are governed by your separate agreement with LearnPath</li>
                <li>You must comply with applicable education and data protection laws (FERPA, GDPR, etc.)</li>
              </ul>
            </div>
          </section>

          {/* Disclaimers */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="text-yellow-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">8. Disclaimers & Limitations</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="font-semibold mb-2">Service Availability</p>
                <p className="text-sm">
                  LearnPath is provided "AS IS" and "AS AVAILABLE" without warranties of any kind. 
                  We do not guarantee uninterrupted, error-free, or secure service. We may suspend 
                  or terminate services for maintenance, updates, or other reasons.
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="font-semibold mb-2">Educational Outcomes</p>
                <p className="text-sm">
                  LearnPath is a tool to support learning. We do not guarantee specific educational 
                  outcomes, skill acquisition, or career advancement. Learning success depends on 
                  individual effort, engagement, and external factors beyond our control.
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="font-semibold mb-2">Third-Party Content</p>
                <p className="text-sm">
                  We are not responsible for the accuracy, quality, or legality of third-party learning 
                  resources. Use external resources at your own discretion.
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="font-semibold mb-2">Limitation of Liability</p>
                <p className="text-sm">
                  To the fullest extent permitted by law, LearnPath and its affiliates shall not be 
                  liable for any indirect, incidental, special, consequential, or punitive damages, 
                  or any loss of profits or revenues, whether incurred directly or indirectly.
                </p>
              </div>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                We reserve the right to suspend or terminate your access to LearnPath at any time, 
                with or without cause, with or without notice, for any reason including:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Violation of these Terms</li>
                <li>Fraudulent, abusive, or illegal activity</li>
                <li>Request from your institution</li>
                <li>Prolonged inactivity</li>
                <li>Discontinuation of service</li>
              </ul>
              <p className="mt-3">
                Upon termination, your right to use LearnPath will immediately cease. Your institution 
                may retain access to your data as per institutional policies.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-700">
              We reserve the right to modify these Terms at any time. We will notify institutions and 
              users of material changes via email or platform notification at least 30 days before 
              changes take effect. Your continued use after changes constitutes acceptance of the 
              updated Terms. If you do not agree to the new Terms, you must stop using LearnPath.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law & Disputes</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the 
                jurisdiction in which LearnPath is registered, without regard to its conflict of law provisions.
              </p>
              <p>
                Any disputes arising from these Terms or your use of LearnPath shall be resolved through:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Good faith negotiation</li>
                <li>Mediation (if negotiation fails)</li>
                <li>Binding arbitration (as a last resort)</li>
              </ul>
            </div>
          </section>

          {/* Miscellaneous */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Miscellaneous</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and LearnPath.</p>
              <p><strong>Severability:</strong> If any provision is found unenforceable, the remaining provisions remain in effect.</p>
              <p><strong>Waiver:</strong> Failure to enforce any right or provision does not constitute a waiver.</p>
              <p><strong>Assignment:</strong> You may not assign these Terms without our consent. We may assign without restriction.</p>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions?</h2>
            <p className="text-gray-700 mb-3">
              If you have questions about these Terms of Service:
            </p>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:legal@learnpath.com" className="text-primary font-semibold hover:underline">
                  legal@learnpath.com
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
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
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

export default TermsOfService;
