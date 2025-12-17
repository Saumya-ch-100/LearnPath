import { useState, useEffect } from 'react';
import { GraduationCap, Users, Clock, Plus, X } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';

const SPECIALIZATION_OPTIONS = [
  'Frontend Development',
  'Backend Development',
  'Full-Stack Development',
  'Mobile Development',
  'DevOps',
  'Cloud Computing',
  'Data Science',
  'Machine Learning',
  'UI/UX Design',
  'Cybersecurity',
  'Database Design',
  'System Architecture',
  'React',
  'Node.js',
  'Python',
  'Java',
  'JavaScript',
  'TypeScript',
  'AWS',
  'Docker',
];

const AVAILABILITY_OPTIONS = [
  'Weekday mornings',
  'Weekday afternoons',
  'Weekday evenings',
  'Weekends only',
  'Flexible schedule',
  'Prefer async communication',
];

const EditMentorProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    bio: '',
    specializations: [],
    availability: '',
    maxLearners: 5,
    isAvailableForMentoring: true,
  });
  const [newSpecialization, setNewSpecialization] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        bio: user.bio || '',
        specializations: user.specializations || [],
        availability: user.availability || '',
        maxLearners: user.maxLearners || 5,
        isAvailableForMentoring: user.isAvailableForMentoring !== false,
      });
    }
  }, [isOpen, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axiosClient.patch('/auth/preferences', formData);
      updateUser(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update mentor profile');
    } finally {
      setLoading(false);
    }
  };

  const addSpecialization = (spec) => {
    if (!formData.specializations.includes(spec)) {
      setFormData(prev => ({
        ...prev,
        specializations: [...prev.specializations, spec]
      }));
    }
    setNewSpecialization('');
  };

  const removeSpecialization = (spec) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.filter(s => s !== spec)
    }));
  };

  const toggleSpecialization = (spec) => {
    if (formData.specializations.includes(spec)) {
      removeSpecialization(spec);
    } else {
      addSpecialization(spec);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Mentoring Profile" size="lg">
      <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
        {error && (
          <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm">
            {error}
          </div>
        )}

        {/* Bio */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <GraduationCap size={18} className="inline mr-2" strokeWidth={2.5} />
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Tell learners about your experience and what you're passionate about..."
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary/30 focus:border-primary focus:outline-none transition-all resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.bio.length} characters
          </p>
        </div>

        {/* Specializations */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <Users size={18} className="inline mr-2" strokeWidth={2.5} />
            Specializations
          </label>
          
          {/* Selected Specializations */}
          {formData.specializations.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.specializations.map((spec) => (
                <Badge key={spec} variant="primary" className="cursor-pointer" onClick={() => removeSpecialization(spec)}>
                  {spec}
                  <X size={14} className="ml-1" strokeWidth={2.5} />
                </Badge>
              ))}
            </div>
          )}

          {/* Common Specializations */}
          <div className="space-y-2">
            <p className="text-xs text-gray-600 mb-2">Select from common specializations:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-xl">
              {SPECIALIZATION_OPTIONS.map((spec) => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => toggleSpecialization(spec)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    formData.specializations.includes(spec)
                      ? 'bg-primary text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-primary'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Specialization */}
          <div className="mt-3">
            <div className="flex gap-2">
              <Input
                value={newSpecialization}
                onChange={(e) => setNewSpecialization(e.target.value)}
                placeholder="Add custom specialization..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newSpecialization.trim()) {
                      addSpecialization(newSpecialization.trim());
                    }
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => newSpecialization.trim() && addSpecialization(newSpecialization.trim())}
                size="sm"
              >
                <Plus size={16} strokeWidth={2.5} />
              </Button>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <Clock size={18} className="inline mr-2" strokeWidth={2.5} />
            Availability
          </label>
          <div className="space-y-2">
            {AVAILABILITY_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, availability: option }))}
                className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                  formData.availability === option
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="font-medium text-gray-900">{option}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Max Learners */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Maximum Number of Learners
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={formData.maxLearners}
            onChange={(e) => setFormData(prev => ({ ...prev, maxLearners: parseInt(e.target.value) }))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>1</span>
            <span className="text-2xl font-bold text-primary">{formData.maxLearners}</span>
            <span>20</span>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="font-semibold text-gray-900">Available for Mentoring</p>
            <p className="text-sm text-gray-600">Learners can request you as their mentor</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isAvailableForMentoring}
              onChange={(e) => setFormData(prev => ({ ...prev, isAvailableForMentoring: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditMentorProfileModal;
