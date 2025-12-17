import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import Button from '../../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-3xl bg-gradient-to-br from-primary/20 to-purple/20 border border-primary/30 mb-6">
            <Search size={64} className="text-primary" strokeWidth={2.5} />
          </div>
          <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard">
            <Button size="lg" className="w-full sm:w-auto">
              <Home size={20} className="mr-2" strokeWidth={2.5} />
              Back to Dashboard
            </Button>
          </Link>
          <Link to="/resources">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Browse Resources
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? <a href="#" className="text-primary hover:text-primary/80 font-medium">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
