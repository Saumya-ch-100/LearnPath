import { useState, useEffect } from 'react';
import { Target, Plus, CheckCircle2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import axiosClient from '../../api/axiosClient';
import AddMilestoneModal from './AddMilestoneModal';

const MilestonesPage = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      const { data } = await axiosClient.get('/milestones');
      console.log('Milestones response:', data);
      setMilestones(Array.isArray(data) ? data : (data.milestones || []));
    } catch (error) {
      console.error('Failed to fetch milestones:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMilestone = async (milestoneData) => {
    try {
      await axiosClient.post('/milestones', milestoneData);
      await fetchMilestones();
    } catch (error) {
      console.error('Error adding milestone:', error);
      alert('Failed to create milestone. Please try again.');
    }
  };

  const handleToggleComplete = async (milestoneId, currentStatus) => {
    try {
      await axiosClient.patch(`/milestones/${milestoneId}`, {
        status: currentStatus === 'completed' ? 'in-progress' : 'completed'
      });
      await fetchMilestones();
    } catch (error) {
      console.error('Error updating milestone:', error);
      alert('Failed to update milestone. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-zinc-400">Loading milestones...</div>
      </div>
    );
  }

  if (milestones.length === 0) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">🎯 Milestones & Achievements</h1>
          <p className="text-gray-600">Set goals and celebrate your learning achievements.</p>
        </div>
        
        <EmptyState
          icon={Target}
          title="No Milestones Yet"
          description="Set your first learning milestone to track your progress towards specific goals. Break down big objectives into achievable targets and celebrate your wins along the way."
          actionLabel="Create Your First Milestone"
          onAction={() => setShowAddModal(true)}
        />

        {/* Add Milestone Modal */}
        <AddMilestoneModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddMilestone}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">🎯 Milestones & Achievements</h1>
          <p className="text-gray-600">Set goals and celebrate your learning achievements.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={20} className="mr-2" strokeWidth={2.5} />
          Add Milestone
        </Button>
      </div>

      {/* Milestones List */}
      <div className="space-y-6">
        {milestones.map((milestone) => (
          <Card key={milestone._id} className="hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl border ${
                    milestone.status === 'completed'
                      ? 'bg-gradient-to-br from-success/20 to-success/10 border-success/20' 
                      : 'bg-gradient-to-br from-orange/20 to-orange/10 border-orange/20'
                  }`}>
                    <Target size={28} strokeWidth={2.5} className={
                      milestone.status === 'completed'
                        ? 'text-success' 
                        : 'text-orange'
                    } />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{milestone.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      {milestone.skillId && (
                        <Badge variant="primary">{milestone.skillId.name}</Badge>
                      )}
                      <Badge variant={milestone.status === 'completed' ? 'success' : 'orange'}>
                        {milestone.status === 'completed' ? '✓ Completed' : 'In Progress'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Target Date */}
                <p className="text-sm text-gray-500 font-medium mb-4">
                  {milestone.status === 'completed'
                    ? `✓ Completed on ${new Date(milestone.completedAt).toLocaleDateString()}` 
                    : `🎯 Target: ${new Date(milestone.targetDate).toLocaleDateString()}`
                  }
                </p>

                {/* Complete Button */}
                {milestone.status !== 'completed' && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleToggleComplete(milestone._id, milestone.status)}
                    >
                      <CheckCircle2 size={16} className="mr-2" strokeWidth={2.5} />
                      Mark as Complete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Milestone Modal */}
      <AddMilestoneModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddMilestone}
      />
    </div>
  );
};

export default MilestonesPage;
