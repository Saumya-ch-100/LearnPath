import { useState, useEffect } from 'react';
import { X, Edit } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import axiosClient from '../../api/axiosClient';

const EditSkillModal = ({ skill, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    'Frontend',
    'Backend',
    'Database',
    'Cloud',
    'DevOps',
    'Programming Language',
    'AI & ML',
    'Data Science',
    'Mobile',
    'Tools',
    'Design',
    'Security',
    'Web3',
    'Other'
  ];

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name || '',
        category: skill.category || '',
        description: skill.description || ''
      });
    }
  }, [skill]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.patch(`/skills/${skill._id}`, formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating skill:', error);
      alert('Failed to update skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Edit size={24} className="text-teal" strokeWidth={2.5} />
            Edit Skill
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Skill Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., React.js"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the skill"
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-teal hover:bg-teal/90"
            >
              {loading ? 'Updating...' : 'Update Skill'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSkillModal;
