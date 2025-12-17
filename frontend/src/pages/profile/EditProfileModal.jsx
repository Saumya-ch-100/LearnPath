import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';

const EditProfileModal = ({ isOpen, onClose, onUpdate }) => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
      setError('');
    }
  }, [isOpen, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check if anything changed
    const nameChanged = formData.name !== user.name;
    const emailChanged = formData.email !== user.email;

    if (!nameChanged && !emailChanged) {
      setError('No changes detected');
      return;
    }

    // Require password if email is being changed
    if (emailChanged && !formData.password) {
      setError('Password is required to change email');
      return;
    }

    setLoading(true);

    try {
      const { data } = await axiosClient.patch('/auth/profile', {
        name: formData.name,
        email: formData.email,
        password: emailChanged ? formData.password : undefined
      });
      
      // Update user in AuthContext and localStorage
      updateUser(data);
      
      if (onUpdate) onUpdate();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" size="md">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name <span className="text-danger">*</span>
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email <span className="text-danger">*</span>
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
            placeholder="Enter your email"
          />
        </div>

        {formData.email !== user?.email && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2.5} />
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                placeholder="Enter your password to change email"
                className="pl-10"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Password verification is required when changing your email address
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
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

export default EditProfileModal;
