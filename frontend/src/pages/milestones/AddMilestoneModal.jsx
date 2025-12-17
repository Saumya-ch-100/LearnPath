import { useState, useEffect } from 'react';
import { Target, Calendar, AlertTriangle } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import axiosClient from '../../api/axiosClient';

const AddMilestoneModal = ({ isOpen, onClose, onAdd }) => {
  const [userSkills, setUserSkills] = useState([]);
  const [dateError, setDateError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skillId: '',
    targetDate: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchUserSkills();
      // Set default target date to 30 days from now
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);
      setFormData(prev => ({
        ...prev,
        targetDate: defaultDate.toISOString().split('T')[0]
      }));
    }
  }, [isOpen]);

  const fetchUserSkills = async () => {
    try {
      const response = await axiosClient.get('/user-skills');
      setUserSkills(Array.isArray(response.data) ? response.data : (response.data.userSkills || []));
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const validateDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setDateError('🚀 Time travel not available yet! Please select a future date.');
      return false;
    }
    setDateError('');
    return true;
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setFormData(prev => ({ ...prev, targetDate: newDate }));
    if (newDate) {
      validateDate(newDate);
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.targetDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (!validateDate(formData.targetDate)) {
      return;
    }

    onAdd({
      title: formData.title,
      description: formData.description,
      skillId: formData.skillId || undefined,
      targetDate: formData.targetDate,
      progress: 0
    });

    // Reset
    setFormData({
      title: '',
      description: '',
      skillId: '',
      targetDate: ''
    });
    setDateError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Milestone" size="md">
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Title <span className="text-danger">*</span>
          </label>
          <Input
            type="text"
            placeholder="E.g., Complete React Course, Build Portfolio Website"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your milestone and what you hope to achieve..."
            rows={3}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Related Skill (Optional)
            </label>
            <select
              value={formData.skillId}
              onChange={(e) => setFormData(prev => ({ ...prev, skillId: e.target.value }))}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
            >
              <option value="">None</option>
              {userSkills.map((us) => (
                <option key={us._id} value={us.skillId?._id}>
                  {us.skillId?.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Target Date <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <Calendar size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2.5} />
              <Input
                type="date"
                value={formData.targetDate}
                onChange={handleDateChange}
                min={new Date().toISOString().split('T')[0]}
                className="pl-10"
              />
            </div>
            {dateError && (
              <div className="mt-2 p-3 bg-amber-50 border-2 border-amber-200 rounded-lg flex items-start gap-2">
                <AlertTriangle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                <p className="text-sm text-amber-800 font-medium">{dateError}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Milestone
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddMilestoneModal;
