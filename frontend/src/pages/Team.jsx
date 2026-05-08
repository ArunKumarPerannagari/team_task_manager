import React, { useState, useEffect } from 'react';
import { Mail, Shield, User as UserIcon, Plus, Trash2, MoreHorizontal } from 'lucide-react';
import { userService } from '../services';
import Avatar from '../components/UI/Avatar';
import Badge from '../components/UI/Badge';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import UserModal from '../components/Team/UserModal';
import ConfirmModal from '../components/UI/ConfirmModal';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.data.data);
    } catch (error) {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSubmit = async (data) => {
    try {
      if (selectedUser) {
        await userService.update(selectedUser._id, data);
        toast.success('User updated');
      } else {
        await userService.create(data);
        toast.success('User created and invited');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await userService.delete(selectedUser._id);
      toast.success('User deleted');
      setIsConfirmOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleRoleChange = async (user, newRole) => {
    try {
      await userService.update(user._id, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-['Outfit',sans-serif]">Team Members</h1>
          <p className="text-slate-500 mt-1">Manage your team and their permissions.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => {
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
            className="btn btn-primary px-6 gap-2 shadow-lg shadow-primary-100"
          >
            <Plus size={20} />
            Invite Member
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Member</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Joined Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Avatar src={user.avatar} name={user.name} />
                      <span className="font-bold text-slate-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail size={14} className="text-slate-400" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={user.role === 'admin' ? 'primary' : 'default'} className="gap-1">
                      {user.role === 'admin' ? <Shield size={12} /> : <UserIcon size={12} />}
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isAdmin ? (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleRoleChange(user, user.role === 'admin' ? 'member' : 'admin')}
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Toggle Role"
                        >
                          <Shield size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedUser(user);
                            setIsConfirmOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-sm">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUserSubmit}
        initialData={selectedUser}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete "${selectedUser?.name}"? This will permanently remove their access and data.`}
      />
    </div>
  );
};

export default Team;
