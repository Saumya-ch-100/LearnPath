import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import axiosClient from '../../api/axiosClient';

const AddResourceModal = ({ onClose, onSuccess }) => {
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    type: 'course',
    provider: '',
    url: '',
    level: 'beginner',
    estimatedHours: '',
    skillIds: [],
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data } = await axiosClient.get('/skills');
      setSkills(Array.isArray(data) ? data : (data.skills || []));
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        estimatedHours: Number(formData.estimatedHours)
      };
      await axiosClient.post('/resources', payload);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating resource:', error);
      alert('Failed to create resource');
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skillId) => {
    setFormData(prev => ({
      ...prev,
      skillIds: prev.skillIds.includes(skillId)
        ? prev.skillIds.filter(id => id !== skillId)
        : [...prev.skillIds, skillId]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Plus size={24} className="text-purple" strokeWidth={2.5} />
            Add New Resource
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Complete React Course 2024"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none transition-all"
                required
              >
                <option value="course">Course</option>
                <option value="book">Book</option>
                <option value="tutorial">Tutorial</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Level *
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none transition-all"
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Provider *
              </label>
              <Input
                type="text"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                placeholder="e.g., Udemy, Coursera"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estimated Hours *
              </label>
              <Input
                type="number"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                URL *
              </label>
              <Input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://..."
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the resource"
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none transition-all resize-none"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Related Skills
              </label>
              <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-xl p-3 space-y-2">
                {skills.map((skill) => (
                  <label key={skill._id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                    <input
                      type="checkbox"
                      checked={formData.skillIds.includes(skill._id)}
                      onChange={() => toggleSkill(skill._id)}
                      className="w-4 h-4 text-purple rounded focus:ring-purple"
                    />
                    <span className="text-sm text-gray-700">{skill.name}</span>
                    <span className="text-xs text-gray-500">({skill.category})</span>
                  </label>
                ))}
              </div>
            </div>
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
              className="flex-1 bg-purple hover:bg-purple/90"
            >
              {loading ? 'Creating...' : 'Create Resource'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResourceModal;
