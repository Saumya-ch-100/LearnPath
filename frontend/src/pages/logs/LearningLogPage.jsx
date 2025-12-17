import { useState, useEffect } from 'react';
import { ScrollText, Calendar, Plus } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import axiosClient from '../../api/axiosClient';
import AddLogModal from './AddLogModal';

const LearningLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data } = await axiosClient.get('/logs');
      console.log('Logs response:', data);
      setLogs(Array.isArray(data) ? data : (data.logs || []));
    } catch (error) {
      console.error('Failed to fetch learning logs:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLog = async (logData) => {
    try {
      await axiosClient.post('/logs', logData);
      await fetchLogs();
    } catch (error) {
      console.error('Error adding log:', error);
      alert('Failed to add log entry. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-zinc-400">Loading learning logs...</div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">📚 Learning Log</h1>
          <p className="text-gray-600">Track your daily learning hours and progress notes.</p>
        </div>
        
        <EmptyState
          icon={ScrollText}
          title="No Learning Logs Yet"
          description="Start tracking your learning journey by logging your daily study sessions. Record what you learned, how long you studied, and track your progress over time."
          actionLabel="Log Your First Session"
          onAction={() => setShowAddModal(true)}
        />

        {/* Add Log Modal */}
        <AddLogModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddLog}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">📚 Learning Log</h1>
          <p className="text-gray-600">Track your daily learning hours and progress notes.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={20} className="mr-2" strokeWidth={2.5} />
          Add Log Entry
        </Button>
      </div>

      {/* Log Entries */}
      <div className="space-y-4">
        {logs.map((log) => (
          <Card key={log._id} className="hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-teal/20 to-teal/10 rounded-xl border border-teal/20">
                  <Calendar size={24} className="text-teal-600" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-gray-900 font-semibold text-lg">
                    {new Date(log.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <Badge variant="primary" className="mt-1">{log.skillId?.name || 'General'}</Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">{Math.round(log.durationMinutes / 60 * 10) / 10}</p>
                <p className="text-sm text-gray-500 font-medium">hours</p>
              </div>
            </div>
            
            <div className="pl-16">
              <p className="text-gray-600 leading-relaxed">{log.notes}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Log Modal */}
      <AddLogModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddLog}
      />
    </div>
  );
};

export default LearningLogPage;
