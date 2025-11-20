import React, { useState } from 'react';
import { User } from '../../types';
import { UserForm } from './UserForm';

interface AdminUsersPageProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id' | 'loyaltyPoints' | 'createdAt'>) => Promise<void>;
  onUpdateUser: (user: User) => Promise<void>;
  onDeleteUser: (userId: number) => Promise<void>;
}

export const AdminUsersPage: React.FC<AdminUsersPageProps> = ({ users, onAddUser, onUpdateUser, onDeleteUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

  const handleOpenModalForAdd = () => {
    setEditingUser(undefined);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(undefined);
  };
  
  const handleDelete = async (userId: number) => {
      if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
          try {
              await onDeleteUser(userId);
          } catch (error: any) {
              alert(`Error: ${error.message}`);
          }
      }
  };
  
  const handleSaveUser = async (user: User | Omit<User, 'id' | 'loyaltyPoints' | 'createdAt'>) => {
      try {
          if ('id' in user) {
            await onUpdateUser(user);
          } else {
            await onAddUser(user);
          }
          handleCloseModal();
      } catch (error: any) {
          alert(`Error: ${error.message}`);
      }
  };

  const getRoleClass = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'seller': return 'bg-blue-100 text-blue-800';
      case 'customer': return 'bg-gray-100 text-gray-800';
      case 'support_agent': return 'bg-teal-100 text-teal-800';
      case 'content_moderator': return 'bg-indigo-100 text-indigo-800';
      case 'marketing_manager': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleToggleExpand = (userId: number) => {
      setExpandedUserId(currentId => currentId === userId ? null : userId);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-cinzel text-[--text-primary]">Manage Users</h1>
          <button
            onClick={handleOpenModalForAdd}
            className="px-6 py-2 bg-[--accent] text-[--accent-foreground] font-bold rounded-full hover:bg-[--accent-hover] transition duration-300 transform hover:scale-105"
           >
              Add New User
           </button>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {users.map(user => {
            const defaultAddress = user.addresses?.find(a => a.isDefault) || user.addresses?.[0];
            return (
            <div key={user.id} className="bg-[--bg-secondary] rounded-lg shadow-lg p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-[--text-primary] text-lg">{user.name}</h3>
                        <p className="text-sm text-[--text-muted]">{user.email}</p>
                    </div>
                    <div className="flex gap-3 text-sm flex-shrink-0">
                        <button onClick={() => handleOpenModalForEdit(user)} className="text-[--accent] hover:text-[--accent-hover] font-semibold">Edit</button>
                        <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-600 font-semibold">Delete</button>
                    </div>
                </div>
                <div onClick={() => handleToggleExpand(user.id)} className="flex justify-between items-center mt-3 pt-3 border-t border-[--border-color] cursor-pointer">
                     <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getRoleClass(user.role)}`}>
                        {user.role.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-semibold text-[--text-muted] flex items-center">
                        Details
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transition-transform ${expandedUserId === user.id ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </span>
                </div>
                {expandedUserId === user.id && (
                    <div className="mt-3 pt-3 border-t border-[--border-color] text-sm space-y-2">
                        <div>
                            <span className="text-[--text-muted] font-semibold">Phone: </span>
                            <span className="text-[--text-primary]">{user.phone || 'N/A'}</span>
                        </div>
                        <div className="text-left">
                            <span className="text-[--text-muted] font-semibold">Address: </span>
                            {defaultAddress && defaultAddress.addressLine1 ? (
                                <address className="text-[--text-primary] not-italic inline">
                                    {defaultAddress.addressLine1}, {defaultAddress.city}, {defaultAddress.postalCode}
                                </address>
                            ) : 'N/A'}
                        </div>
                        <div>
                            <span className="text-[--text-muted] font-semibold">Loyalty Points: </span>
                            <span className="text-[--text-primary] font-bold">{user.loyaltyPoints}</span>
                        </div>
                         <div>
                            <span className="text-[--text-muted] font-semibold">Registered: </span>
                            <span className="text-[--text-primary]">{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                )}
            </div>
        )})}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-[--bg-secondary] rounded-lg shadow-xl overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[--bg-tertiary]">
            <tr>
              <th className="p-4 font-semibold text-[--text-secondary]">Name</th>
              <th className="p-4 font-semibold text-[--text-secondary]">Email</th>
              <th className="p-4 font-semibold text-[--text-secondary]">Role</th>
              <th className="p-4 font-semibold text-[--text-secondary]">Date Registered</th>
              <th className="p-4 font-semibold text-[--text-secondary]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
                const defaultAddress = user.addresses?.find(a => a.isDefault) || user.addresses?.[0];
                return (
              <React.Fragment key={user.id}>
                <tr className="border-b border-[--border-color] hover:bg-[--bg-tertiary] cursor-pointer" onClick={() => handleToggleExpand(user.id)}>
                  <td className="p-4 font-bold text-[--text-primary] flex items-center gap-2">
                    <span className={`transform transition-transform duration-200 ${expandedUserId === user.id ? 'rotate-90 text-[--accent]' : 'text-gray-400'}`}>▶</span>
                    {user.name}
                  </td>
                  <td className="p-4 text-[--text-muted]">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getRoleClass(user.role)}`}>
                      {user.role.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-[--text-muted]">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="flex gap-4">
                      <button onClick={(e) => { e.stopPropagation(); handleOpenModalForEdit(user); }} className="text-[--accent] hover:text-[--accent-hover] font-semibold">Edit</button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(user.id); }} className="text-red-500 hover:text-red-600 font-semibold">Delete</button>
                    </div>
                  </td>
                </tr>
                 {expandedUserId === user.id && (
                  <tr className="bg-[--bg-tertiary]/50">
                      <td colSpan={5} className="p-4 transition-all duration-300 ease-in-out">
                          <div className="bg-[--bg-secondary] p-4 rounded-md border border-[--border-color]">
                              <h4 className="font-bold text-[--accent] mb-2 font-cinzel">User Details</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  <div>
                                      <span className="text-[--text-muted] block font-semibold">Phone</span>
                                      <span className="text-[--text-primary]">{user.phone || 'N/A'}</span>
                                  </div>
                                  <div className="md:col-span-2">
                                      <span className="text-[--text-muted] block font-semibold">Default Address</span>
                                      {defaultAddress && defaultAddress.addressLine1 ? (
                                        <address className="text-[--text-primary] not-italic">
                                            {defaultAddress.addressLine1}<br/>
                                            {defaultAddress.city}, {defaultAddress.postalCode}<br/>
                                            {defaultAddress.country}
                                        </address>
                                      ) : 'N/A'}
                                  </div>
                                  <div>
                                     <span className="text-[--text-muted] block font-semibold">Loyalty Points</span>
                                     <span className="text-[--text-primary] font-bold">{user.loyaltyPoints}</span>
                                  </div>
                              </div>
                          </div>
                      </td>
                  </tr>
                )}
              </React.Fragment>
            )})}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
          <UserForm
            user={editingUser}
            onClose={handleCloseModal}
            onSave={handleSaveUser}
          />
      )}
    </div>
  );
};