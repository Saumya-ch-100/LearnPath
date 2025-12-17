import { useState, useEffect } from 'react';
import { Plus, Target, TrendingUp, BookOpen, Edit, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import axiosClient from '../../api/axiosClient';
import AddSkillModal from './AddSkillModal';

const SkillProfilePage = () => {
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const levelLabels = {
    1: 'Beginner',
    2: 'Intermediate',
    3: 'Advanced',
    4: 'Expert'
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await axiosClient.get('/user-skills');
      console.log('User skills response:', response.data);
      setUserSkills(Array.isArray(response.data) ? response.data : (response.data.userSkills || []));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching skills:', error);
      console.error('Error details:', error.response?.data);
      if (error.response?.status === 401) {
        alert('Session expired. Please log in again.');
      }
      setLoading(false);
    }
  };

  const handleAddSkill = async (skillData) => {
    try {
      await axiosClient.post('/user-skills', skillData);
      await fetchSkills();
    } catch (error) {
      console.error('Error adding skill:', error);
      alert('Failed to add skill. Please try again.');
    }
  };

  const handleDeleteSkill = async (userSkillId) => {
    if (!confirm('Are you sure you want to remove this skill?')) return;
    
    try {
      await axiosClient.delete(`/user-skills/${userSkillId}`);
      await fetchSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Failed to delete skill. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-zinc-400">Loading skills...</div>
      </div>
    );
  }

  if (userSkills.length === 0) {
    return (
      <div>
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Skill Profile</h1>
          <p className="text-gray-600 text-lg">Track and visualize your learning progress across skills</p>
        </div>

        <EmptyState
          icon={Target}
          title="No skills added yet"
          description="Start tracking your learning journey by adding your first skill. Choose from popular technologies or create custom ones."
          actionLabel="Add Your First Skill"
          onAction={() => setShowAddModal(true)}
        />

        {/* Add Skill Modal */}
        <AddSkillModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddSkill}
          existingSkills={userSkills}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Skill Profile</h1>
          <p className="text-gray-600 text-lg">Track and visualize your learning progress across skills</p>
        </div>
        <Button className="gap-2" onClick={() => setShowAddModal(true)}>
          <Plus size={20} strokeWidth={2.5} />
          Add Skill
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {userSkills.map((userSkill) => (
          <Card key={userSkill._id} hover>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{userSkill.skillId?.name || 'Skill'}</h3>
                <Badge variant="primary">{userSkill.skillId?.category || 'General'}</Badge>
              </div>
              <Badge variant="teal">Target: {levelLabels[userSkill.targetLevel] || userSkill.targetLevel}</Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 font-medium">Progress</span>
                <span className="text-gray-900 font-bold">{userSkill.progressPercent}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-teal rounded-full transition-all duration-500"
                  style={{ width: `${userSkill.progressPercent}%` }}
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm text-gray-600 font-medium">Current: <span className="font-bold text-gray-900">{levelLabels[userSkill.currentLevel] || userSkill.currentLevel}</span></span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleDeleteSkill(userSkill._id)}
                className="text-danger hover:bg-danger/10"
              >
                <Trash2 size={16} strokeWidth={2.5} />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Skill Modal */}
      <AddSkillModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddSkill}
        existingSkills={userSkills}
      />
    </div>
  );
};

export default SkillProfilePage;
