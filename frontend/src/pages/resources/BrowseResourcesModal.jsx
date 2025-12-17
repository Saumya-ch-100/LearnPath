import { useState, useEffect } from 'react';
import { Search, Filter, ExternalLink, Plus, BookOpen } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import axiosClient from '../../api/axiosClient';

const BrowseResourcesModal = ({ isOpen, onClose, onEnroll }) => {
  const [allResources, setAllResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    level: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAllResources();
    }
  }, [isOpen]);

  const fetchAllResources = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/resources');
      console.log('All resources response:', response.data);
      setAllResources(Array.isArray(response.data) ? response.data : (response.data.resources || []));
    } catch (error) {
      console.error('Error fetching resources:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = allResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.provider?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !filters.type || resource.type === filters.type;
    const matchesLevel = !filters.level || resource.level === filters.level;
    
    // Check if any of the resource's linked skills match the selected category
    const matchesCategory = !filters.category || (
      resource.skillIds && Array.isArray(resource.skillIds) && 
      resource.skillIds.some(skill => {
        const category = typeof skill === 'string' ? null : skill?.category;
        return category === filters.category;
      })
    );
    
    return matchesSearch && matchesType && matchesLevel && matchesCategory;
  });

  const handleEnroll = async (resourceId) => {
    try {
      await onEnroll(resourceId);
    } catch (error) {
      console.error('Error enrolling:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Browse Resources" size="xl">
      <div className="p-6 space-y-6">
        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2.5} />
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:border-primary outline-none"
            >
              <option value="">All Types</option>
              <option value="course">Course</option>
              <option value="video">Video</option>
              <option value="book">Book</option>
              <option value="documentation">Documentation</option>
              <option value="article">Article</option>
            </select>

            <select
              value={filters.level}
              onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
              className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:border-primary outline-none"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl focus:border-primary outline-none"
            >
              <option value="">All Categories</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
              <option value="Cloud">Cloud</option>
              <option value="DevOps">DevOps</option>
              <option value="Programming Language">Programming Language</option>
              <option value="AI & ML">AI & ML</option>
              <option value="Data Science">Data Science</option>
              <option value="Mobile">Mobile</option>
              <option value="Tools">Tools</option>
              <option value="Design">Design</option>
              <option value="Security">Security</option>
              <option value="Web3">Web3</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="max-h-[60vh] overflow-y-auto space-y-3">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading resources...</div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No resources found</div>
          ) : (
            filteredResources.map((resource) => (
              <Card key={resource._id} className="hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-gradient-to-br from-purple/20 to-purple/10 rounded-xl border border-purple/20">
                        <BookOpen size={24} className="text-purple" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1">{resource.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="primary">{resource.type}</Badge>
                          <Badge variant="teal">{resource.provider}</Badge>
                          <Badge variant={
                            resource.level === 'beginner' ? 'success' :
                            resource.level === 'intermediate' ? 'warning' : 'danger'
                          }>
                            {resource.level}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {resource.url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(resource.url, '_blank')}
                      >
                        <ExternalLink size={16} strokeWidth={2.5} />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => handleEnroll(resource._id)}
                    >
                      <Plus size={16} strokeWidth={2.5} className="mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BrowseResourcesModal;
