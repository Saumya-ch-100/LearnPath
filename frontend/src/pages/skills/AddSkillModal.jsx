import { useState, useEffect } from 'react';
import { Search, Target } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import axiosClient from '../../api/axiosClient';

const AddSkillModal = ({ isOpen, onClose, onAdd, existingSkills = [] }) => {
  const [allSkills, setAllSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [formData, setFormData] = useState({
    currentLevel: 'beginner',
    targetLevel: 'intermediate'
  });

  useEffect(() => {
    if (isOpen) {
      fetchAllSkills();
    }
  }, [isOpen]);

  const fetchAllSkills = async () => {
    try {
      const response = await axiosClient.get('/skills');
      console.log('All skills response:', response.data);
      setAllSkills(Array.isArray(response.data) ? response.data : (response.data.skills || []));
    } catch (error) {
      console.error('Error fetching skills:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const filteredSkills = allSkills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.category.toLowerCase().includes(searchQuery.toLowerCase());
    const notAdded = !existingSkills.some(us => us.skillId?._id === skill._id);
    return matchesSearch && notAdded;
  });

  const levelToNumber = {
    'beginner': 1,
    'intermediate': 2,
    'advanced': 3,
    'expert': 4
  };

  const handleSubmit = () => {
    if (!selectedSkill) return;
    
    onAdd({
      skillId: selectedSkill._id,
      currentLevel: levelToNumber[formData.currentLevel],
      targetLevel: levelToNumber[formData.targetLevel]
    });
    
    // Reset
    setSelectedSkill(null);
    setFormData({ currentLevel: 'beginner', targetLevel: 'intermediate' });
    setSearchQuery('');
    onClose();
  };

  const levels = ['beginner', 'intermediate', 'advanced', 'expert'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Skill" size="md">
      <div className="p-6 space-y-6">
        {/* Step 1: Select Skill */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select a Skill
          </label>
          <div className="relative mb-4">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2.5} />
            <Input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="max-h-64 overflow-y-auto space-y-2 border border-gray-200 rounded-xl p-3 bg-gray-50">
            {filteredSkills.map((skill) => (
              <button
                key={skill._id}
                onClick={() => setSelectedSkill(skill)}
                className={`w-full p-3 rounded-xl text-left transition-all ${
                  selectedSkill?._id === skill._id
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{skill.name}</p>
                    <Badge variant="primary" className="mt-1">{skill.category}</Badge>
                  </div>
                  {selectedSkill?._id === skill._id && (
                    <Target size={20} className="text-primary" strokeWidth={2.5} />
                  )}
                </div>
              </button>
            ))}
            {filteredSkills.length === 0 && (
              <p className="text-center text-gray-500 py-8">No skills found</p>
            )}
          </div>
        </div>

        {/* Step 2: Set Levels */}
        {selectedSkill && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setFormData(prev => ({ ...prev, currentLevel: level }))}
                    className={`p-3 rounded-xl text-sm font-medium capitalize transition-all ${
                      formData.currentLevel === level
                        ? 'bg-gradient-to-br from-teal/20 to-teal/10 border-2 border-teal text-teal-700'
                        : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Target Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setFormData(prev => ({ ...prev, targetLevel: level }))}
                    className={`p-3 rounded-xl text-sm font-medium capitalize transition-all ${
                      formData.targetLevel === level
                        ? 'bg-gradient-to-br from-purple/20 to-purple/10 border-2 border-purple text-purple-700'
                        : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedSkill}
          >
            Add Skill
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddSkillModal;
