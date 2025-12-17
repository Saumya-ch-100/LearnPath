import { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Edit, Trash2, ExternalLink } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import axiosClient from '../../api/axiosClient';
import AddResourceModal from './AddResourceModal';
import EditResourceModal from './EditResourceModal';
import DeleteResourceModal from './DeleteResourceModal';

const AdminResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [deletingResource, setDeletingResource] = useState(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data } = await axiosClient.get('/resources');
      setResources(Array.isArray(data) ? data : (data.resources || []));
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.provider?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || resource.type === filterType;
    return matchesSearch && matchesType;
  });

  const types = ['all', ...new Set(resources.map(r => r.type))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-zinc-400">Loading resources...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center gap-3">
            <BookOpen size={36} className="text-purple" strokeWidth={2.5} />
            Manage Resources
          </h1>
          <p className="text-gray-600 text-lg">Add, edit, or remove learning resources</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus size={20} strokeWidth={2.5} />
          Add Resource
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2.5} />
          <Input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {types.map((type) => (
            <Button
              key={type}
              variant={filterType === type ? 'primary' : 'secondary'}
              onClick={() => setFilterType(type)}
              className="capitalize"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <p className="text-gray-600 text-sm font-medium mb-1">Total Resources</p>
          <p className="text-4xl font-bold text-gray-900">{resources.length}</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm font-medium mb-1">Courses</p>
          <p className="text-4xl font-bold text-gray-900">{resources.filter(r => r.type === 'course').length}</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm font-medium mb-1">Books</p>
          <p className="text-4xl font-bold text-gray-900">{resources.filter(r => r.type === 'book').length}</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm font-medium mb-1">Videos</p>
          <p className="text-4xl font-bold text-gray-900">{resources.filter(r => r.type === 'video').length}</p>
        </Card>
      </div>

      {/* Resources List */}
      <div className="space-y-4">
        {filteredResources.map((resource) => (
          <Card key={resource._id} className="hover:shadow-lg transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-br from-purple/20 to-purple/10 rounded-lg border border-purple/20">
                    <BookOpen size={20} className="text-purple" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{resource.title}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="purple" className="capitalize">{resource.type}</Badge>
                      <Badge variant="primary" className="capitalize">{resource.level}</Badge>
                      {resource.provider && (
                        <span className="text-sm text-gray-600">{resource.provider}</span>
                      )}
                      {resource.estimatedHours && (
                        <span className="text-sm text-gray-600">• {resource.estimatedHours}h</span>
                      )}
                    </div>
                  </div>
                </div>
                {resource.description && (
                  <p className="text-gray-600 text-sm mb-3 pl-11">{resource.description}</p>
                )}
                {resource.skillIds && resource.skillIds.length > 0 && (
                  <div className="flex items-center gap-2 mb-3 pl-11">
                    <span className="text-xs font-semibold text-gray-500">Linked Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {resource.skillIds.map((skill, index) => (
                        <Badge key={index} variant="teal" className="text-xs">
                          {typeof skill === 'string' ? skill : skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 pl-11"
                  >
                    View Resource <ExternalLink size={14} />
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setEditingResource(resource)}
                  className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <Edit size={18} strokeWidth={2.5} />
                </button>
                <button 
                  onClick={() => setDeletingResource(resource)}
                  className="p-2 text-gray-600 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                >
                  <Trash2 size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddResourceModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            fetchResources();
            setShowAddModal(false);
          }}
        />
      )}
      {editingResource && (
        <EditResourceModal
          resource={editingResource}
          onClose={() => setEditingResource(null)}
          onSuccess={() => {
            fetchResources();
            setEditingResource(null);
          }}
        />
      )}
      {deletingResource && (
        <DeleteResourceModal
          resource={deletingResource}
          onClose={() => setDeletingResource(null)}
          onSuccess={() => {
            fetchResources();
            setDeletingResource(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminResourcesPage;
