import { useState, useEffect } from 'react';
import { Target, Plus, Search, Edit, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import axiosClient from '../../api/axiosClient';
import AddSkillModal from './AddSkillModal';
import EditSkillModal from './EditSkillModal';
import DeleteSkillModal from './DeleteSkillModal';

const AdminSkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [deletingSkill, setDeletingSkill] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data } = await axiosClient.get('/skills');
      setSkills(Array.isArray(data) ? data : (data.skills || []));
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by category
  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-zinc-400">Loading skills...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center gap-3">
            <Target size={36} className="text-teal" strokeWidth={2.5} />
            Manage Skills
          </h1>
          <p className="text-gray-600 text-lg">Add, edit, or remove skills from the platform</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus size={20} strokeWidth={2.5} />
          Add Skill
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2.5} />
        <Input
          type="text"
          placeholder="Search skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <p className="text-gray-600 text-sm font-medium mb-1">Total Skills</p>
          <p className="text-4xl font-bold text-gray-900">{skills.length}</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm font-medium mb-1">Categories</p>
          <p className="text-4xl font-bold text-gray-900">{Object.keys(groupedSkills).length}</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm font-medium mb-1">Most Popular</p>
          <p className="text-lg font-bold text-gray-900">{skills[0]?.category || 'N/A'}</p>
        </Card>
      </div>

      {/* Skills by Category */}
      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <Card key={category}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">{category}</h3>
              <Badge variant="primary">{categorySkills.length} skills</Badge>
            </div>
            <div className="space-y-2">
              {categorySkills.map((skill) => (
                <div key={skill._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{skill.name}</p>
                    {skill.description && (
                      <p className="text-sm text-gray-600 mt-1">{skill.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setEditingSkill(skill)}
                      className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Edit size={18} strokeWidth={2.5} />
                    </button>
                    <button 
                      onClick={() => setDeletingSkill(skill)}
                      className="p-2 text-gray-600 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddSkillModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            fetchSkills();
            setShowAddModal(false);
          }}
        />
      )}
      {editingSkill && (
        <EditSkillModal
          skill={editingSkill}
          onClose={() => setEditingSkill(null)}
          onSuccess={() => {
            fetchSkills();
            setEditingSkill(null);
          }}
        />
      )}
      {deletingSkill && (
        <DeleteSkillModal
          skill={deletingSkill}
          onClose={() => setDeletingSkill(null)}
          onSuccess={() => {
            fetchSkills();
            setDeletingSkill(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminSkillsPage;
