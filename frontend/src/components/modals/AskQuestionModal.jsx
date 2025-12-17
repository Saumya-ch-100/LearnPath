import { useState } from 'react';
import { X, MessageSquare } from 'lucide-react';
import Button from '../ui/Button';

const AskQuestionModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [question, setQuestion] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question);
      setQuestion('');
    }
  };

  const handleClose = () => {
    setQuestion('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
              <MessageSquare className="text-primary" size={20} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Ask Your Mentor</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} strokeWidth={2.5} className="text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like to ask your mentor?"
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              disabled={isLoading}
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              Your mentor will be notified and can respond to your question.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={isLoading || !question.trim()}
            >
              {isLoading ? 'Sending...' : 'Send Question'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskQuestionModal;
