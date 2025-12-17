import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import axiosClient from '../../api/axiosClient';

const AddLogModal = ({ isOpen, onClose, onAdd }) => {
  const [userSkills, setUserSkills] = useState([]);
  const [formData, setFormData] = useState({
    skillId: '',
    date: new Date().toISOString().split('T')[0],
    durationMinutes: 60,
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchUserSkills();
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

  const handleSubmit = () => {
    if (!formData.skillId || !formData.durationMinutes) {
      alert('Please fill in all required fields');
      return;
    }

    onAdd({
      skillId: formData.skillId,
      date: formData.date,
      durationMinutes: parseFloat(formData.durationMinutes),
      notes: formData.notes
    });

    // Reset
    setFormData({
      skillId: '',
      date: new Date().toISOString().split('T')[0],
      durationMinutes: 60,
      notes: ''
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Learning Session" size="md">
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Skill <span className="text-danger">*</span>
          </label>
          <select
            value={formData.skillId}
            onChange={(e) => setFormData(prev => ({ ...prev, skillId: e.target.value }))}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
          >
            <option value="">Select a skill...</option>
            {userSkills.map((us) => (
              <option key={us._id} value={us.skillId?._id}>
                {us.skillId?.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <Calendar size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2.5} />
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Duration (minutes) <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <Clock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2.5} />
              <Input
                type="number"
                min="15"
                step="15"
                value={formData.durationMinutes}
                onChange={(e) => setFormData(prev => ({ ...prev, durationMinutes: e.target.value }))}
                className="pl-10"
                placeholder="e.g., 90"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="What did you learn today? Any challenges or achievements?"
            rows={4}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Save Log Entry
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddLogModal;
