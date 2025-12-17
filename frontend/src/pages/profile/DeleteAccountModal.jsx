import { useState } from 'react';
import { Trash2, AlertTriangle, Lock } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DeleteAccountModal = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);

    try {
      await axiosClient.delete('/auth/account', {
        data: { password }
      });
      
      // Logout and redirect to home
      logout();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete account');
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Account" size="md">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Warning Banner */}
        <div className="p-4 bg-danger/10 border-2 border-danger/20 rounded-xl flex items-start gap-3">
          <AlertTriangle size={24} className="text-danger flex-shrink-0 mt-0.5" strokeWidth={2.5} />
          <div className="flex-1">
            <h4 className="font-bold text-danger mb-1">Warning: This action cannot be undone!</h4>
            <p className="text-sm text-danger/80">
              Deleting your account will permanently remove:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-danger/80">
              <li>• Your profile and personal information</li>
              {user?.role === 'admin' ? (
                <>
                  <li>• Your admin access to the platform</li>
                  <li>• <strong>Note:</strong> Platform data (skills, resources, users) will NOT be deleted</li>
                </>
              ) : user?.role === 'mentor' ? (
                <>
                  <li>• Your mentor profile and sessions</li>
                  <li>• All learners you are mentoring will lose access to you</li>
                </>
              ) : (
                <>
                  <li>• All your skills and progress tracking</li>
                  <li>• All learning logs and milestones</li>
                  <li>• All resource enrollments and saved items</li>
                </>
              )}
              <li>• All other data associated with your account</li>
            </ul>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Type DELETE to confirm <span className="text-danger">*</span>
          </label>
          <Input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            required
            placeholder="Type DELETE in capital letters"
            className="font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Enter your password <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2.5} />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Confirm with your password"
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-danger hover:bg-danger/90 text-white"
          >
            <Trash2 size={18} strokeWidth={2.5} />
            {loading ? 'Deleting Account...' : 'Delete Account Permanently'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DeleteAccountModal;
