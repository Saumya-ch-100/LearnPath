import { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, Plus, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import axiosClient from '../../api/axiosClient';
import BrowseResourcesModal from './BrowseResourcesModal';

const ResourceLibraryPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBrowseModal, setShowBrowseModal] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data } = await axiosClient.get('/enrollments');
      console.log('Enrollments response:', data);
      setResources(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (resourceId) => {
    try {
      await axiosClient.post('/enrollments', { resourceId });
      await fetchResources();
      setShowBrowseModal(false);
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Failed to add resource. Please try again.');
    }
  };

  const handleUnenroll = async (enrollmentId) => {
    if (!confirm('Remove this resource from your library?')) return;
    
    try {
      await axiosClient.delete(`/enrollments/${enrollmentId}`);
      await fetchResources();
    } catch (error) {
      console.error('Error unenrolling:', error);
      alert('Failed to remove resource. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-zinc-400">Loading resources...</div>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Resource Library</h1>
          <p className="text-gray-600 text-lg">Curated learning resources for your skill development</p>
        </div>
        
        <EmptyState
          icon={BookOpen}
          title="No Resources Yet"
          description="Start building your learning library by discovering and saving helpful resources like courses, videos, books, and documentation."
          actionLabel="Browse Resources"
          onAction={() => setShowBrowseModal(true)}
        />

        {/* Browse Resources Modal */}
        <BrowseResourcesModal
          isOpen={showBrowseModal}
          onClose={() => setShowBrowseModal(false)}
          onEnroll={handleEnroll}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Resource Library</h1>
          <p className="text-gray-600 text-lg">Curated learning resources for your skill development</p>
        </div>
        <Button onClick={() => setShowBrowseModal(true)}>
          <Plus size={20} className="mr-2" strokeWidth={2.5} />
          Add Resource
        </Button>
      </div>

      {/* Resources Grid */}
      <div className="space-y-4">
        {resources.map((resource) => (
          <Card key={resource._id} hover>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple/20 to-purple/10 rounded-xl border border-purple/20">
                    <BookOpen size={24} className="text-purple" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.resourceId?.title || 'Untitled Resource'}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="primary">{resource.resourceId?.type || 'Unknown'}</Badge>
                      <Badge variant="teal">{resource.resourceId?.provider || 'No provider'}</Badge>
                      <Badge 
                        variant={
                          resource.status === 'completed' ? 'success' : 
                          resource.status === 'in-progress' ? 'warning' : 
                          'default'
                        }
                      >
                        {resource.status || 'enrolled'}
                      </Badge>
                    </div>
                    {resource.progressPercent > 0 && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600 font-medium">Progress</span>
                          <span className="text-gray-900 font-bold">{resource.progressPercent}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple to-teal transition-all duration-500"
                            style={{ width: `${resource.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {resource.resourceId?.url && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => window.open(resource.resourceId.url, '_blank')}
                  >
                    <ExternalLink size={18} strokeWidth={2.5} />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleUnenroll(resource._id)}
                  className="text-danger hover:bg-danger/10"
                >
                  <Trash2 size={18} strokeWidth={2.5} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Browse Resources Modal */}
      <BrowseResourcesModal
        isOpen={showBrowseModal}
        onClose={() => setShowBrowseModal(false)}
        onEnroll={handleEnroll}
      />
    </div>
  );
};

export default ResourceLibraryPage;
