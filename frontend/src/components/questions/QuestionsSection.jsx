import { MessageSquare, CheckCircle, Clock } from 'lucide-react';

const QuestionsSection = ({ questions }) => {
  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="mx-auto text-gray-300 mb-3" size={40} />
        <p className="text-gray-500">No questions asked yet</p>
        <p className="text-gray-400 text-sm mt-1">Ask your mentor anything!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <div
          key={q._id}
          className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
        >
          {/* Question Header */}
          <div className="flex items-start gap-3 mb-3">
            <div className={`p-2 rounded-lg ${q.isAnswered ? 'bg-green-100' : 'bg-yellow-100'}`}>
              {q.isAnswered ? (
                <CheckCircle className="text-success" size={20} strokeWidth={2.5} />
              ) : (
                <Clock className="text-warning" size={20} strokeWidth={2.5} />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  q.isAnswered ? 'bg-green-100 text-success' : 'bg-yellow-100 text-warning'
                }`}>
                  {q.isAnswered ? 'Answered' : 'Pending'}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(q.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-900 font-medium">Your Question:</p>
              <p className="text-gray-700 mt-1">{q.question}</p>
            </div>
          </div>

          {/* Answer */}
          {q.isAnswered && q.reply && (
            <div className="ml-11 pl-4 border-l-2 border-primary">
              <p className="text-sm font-semibold text-primary mb-1">
                {q.mentorId?.name}'s Answer:
              </p>
              <p className="text-gray-700">{q.reply}</p>
              <p className="text-xs text-gray-400 mt-2">
                Answered {new Date(q.answeredAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionsSection;
