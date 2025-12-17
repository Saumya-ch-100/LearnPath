import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import Button from '../../components/ui/Button';
import axiosClient from '../../api/axiosClient';

const DeleteSkillModal = ({ skill, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axiosClient.delete(`/skills/${skill._id}`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Failed to delete skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle size={24} className="text-danger" strokeWidth={2.5} />
            Delete Skill
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <span className="font-semibold text-gray-900">"{skill.name}"</span>?
          </p>
          <p className="text-sm text-danger bg-danger/10 p-3 rounded-lg">
            This action cannot be undone. This skill will be removed from all user profiles and resources.
          </p>

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
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 bg-danger hover:bg-danger/90"
            >
              {loading ? 'Deleting...' : 'Delete Skill'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteSkillModal;
