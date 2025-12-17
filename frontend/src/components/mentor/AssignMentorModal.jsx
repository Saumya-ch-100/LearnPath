import { useState, useEffect } from 'react';
import { Users, CheckCircle2, User, X } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';
import axiosClient from '../../api/axiosClient';

const AssignMentorModal = ({ isOpen, onClose, currentMentor, onAssigned }) => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchMentors();
    }
  }, [isOpen]);

  const fetchMentors = async () => {
    try {
      const response = await axiosClient.get('/mentors');
      setMentors(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedMentor) return;

    setAssigning(true);
    try {
      await axiosClient.post('/learners/assign-mentor', {
        mentorId: selectedMentor._id,
      });
      onAssigned(selectedMentor);
      onClose();
    } catch (error) {
      console.error('Error assigning mentor:', error);
      alert(error.response?.data?.message || 'Failed to assign mentor');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Your Mentor" size="lg">
      <div className="p-6">
        {currentMentor && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold">
                {currentMentor.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Mentor</p>
                <p className="font-semibold text-gray-900">{currentMentor.name}</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <Spinner size="md" />
            <p className="text-gray-500 font-medium">Loading mentors...</p>
          </div>
        ) : mentors.length === 0 ? (
          <div className="text-center py-8">
            <Users className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-500">No mentors available at the moment</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {mentors.map((mentor) => (
              <div
                key={mentor._id}
                onClick={() => setSelectedMentor(mentor)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedMentor?._id === mentor._id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {mentor.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
                        {currentMentor?._id === mentor._id && (
                          <Badge variant="primary" className="text-xs">Current</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{mentor.email}</p>
                      
                      {mentor.bio && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{mentor.bio}</p>
                      )}

                      {mentor.specializations && mentor.specializations.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {mentor.specializations.map((spec, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          <span>
                            {mentor.currentLearners}/{mentor.maxLearners} learners
                          </span>
                        </div>
                        {mentor.isAcceptingLearners ? (
                          <Badge variant="success" className="text-xs">Available</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Full</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedMentor?._id === mentor._id && (
                    <CheckCircle2 className="text-primary flex-shrink-0" size={24} strokeWidth={2.5} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <Button variant="ghost" onClick={onClose} disabled={assigning}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedMentor || assigning || !selectedMentor?.isAcceptingLearners}
            className="relative"
          >
            {assigning ? (
              <span className="flex items-center gap-2">
                <Spinner size="sm" />
                Assigning...
              </span>
            ) : (
              'Assign Mentor'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AssignMentorModal;
