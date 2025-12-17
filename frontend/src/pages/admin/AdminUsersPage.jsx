import { useState, useEffect } from 'react';
import { Users, Search, Edit, Trash2, Shield } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import axiosClient from '../../api/axiosClient';
import EditUserModal from './EditUserModal';
import DeleteUserModal from './DeleteUserModal';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axiosClient.get('/admin/users');
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const roles = ['all', 'learner', 'mentor', 'admin'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-zinc-400">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center gap-3">
            <Users size={36} className="text-primary" strokeWidth={2.5} />
            Manage Users
          </h1>
          <p className="text-gray-600 text-lg">View and manage user accounts</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2.5} />
          <Input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-4 py-2 rounded-xl font-medium capitalize transition-all ${
                filterRole === role
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <p className="text-gray-600 text-sm font-medium mb-1">Total Users</p>
          <p className="text-4xl font-bold text-gray-900">{users.length}</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm font-medium mb-1">Learners</p>
          <p className="text-4xl font-bold text-gray-900">{users.filter(u => u.role === 'learner').length}</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm font-medium mb-1">Admins</p>
          <p className="text-4xl font-bold text-gray-900">{users.filter(u => u.role === 'admin').length}</p>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-teal flex items-center justify-center text-white font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-semibold text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{user.email}</td>
                  <td className="py-4 px-4">
                    <Badge 
                      variant={
                        user.role === 'admin' ? 'orange' :
                        user.role === 'mentor' ? 'purple' :
                        'primary'
                      }
                      className="capitalize"
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setEditingUser(user)}
                        className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Edit size={18} strokeWidth={2.5} />
                      </button>
                      <button 
                        onClick={() => setDeletingUser(user)}
                        className="p-2 text-gray-600 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modals */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={() => {
            fetchUsers();
            setEditingUser(null);
          }}
        />
      )}
      {deletingUser && (
        <DeleteUserModal
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
          onSuccess={() => {
            fetchUsers();
            setDeletingUser(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminUsersPage;
