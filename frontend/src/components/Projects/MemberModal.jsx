import React, { useState } from 'react';
import { X, UserPlus, Trash2, Search } from 'lucide-react';
import Modal from '../UI/Modal';
import Avatar from '../UI/Avatar';

const MemberModal = ({ isOpen, onClose, members, allUsers, onAdd, onRemove }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = allUsers.filter(user => 
    !members.some(m => m._id === user._id) &&
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Members">
      <div className="space-y-6">
        {/* Current Members */}
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Project Team</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {members.map((member) => (
              <div key={member._id} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-3">
                  <Avatar src={member.avatar} name={member.name} size="sm" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onRemove(member._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Remove from project"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Add New Members</h3>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="input pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Avatar src={user.avatar} name={user.name} size="sm" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onAdd(user._id)}
                    className="btn btn-secondary py-1.5 px-3 text-xs gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <UserPlus size={14} />
                    Add
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-400 py-4 text-sm">No other users found.</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MemberModal;
