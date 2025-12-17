import { useState } from 'react';
import { X, MessageSquare } from 'lucide-react';
import Button from '../ui/Button';

const ReplyQuestionModal = ({ isOpen, onClose, onSubmit, question, isLoading }) => {
  const [reply, setReply] = useState('');

  if (!isOpen || !question) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reply.trim()) {
      onSubmit(reply);
      setReply('');
    }
  };

  const handleClose = () => {
    setReply('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
              <MessageSquare className="text-primary" size={20} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Reply to Question</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} strokeWidth={2.5} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Learner's Question */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Question from {question.learnerId?.name}:
            </p>
            <p className="text-gray-900">{question.question}</p>
            <p className="text-xs text-gray-400 mt-2">
              Asked {new Date(question.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Answer
              </label>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your answer here..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                disabled={isLoading}
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                The learner will be notified when you submit your answer.
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
                disabled={isLoading || !reply.trim()}
              >
                {isLoading ? 'Sending...' : 'Send Answer'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReplyQuestionModal;
