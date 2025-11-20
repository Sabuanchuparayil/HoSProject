import React, { useState } from 'react';
import { Role, User } from '../../types';
import { RoleForm } from './RoleForm';

interface AdminRolesPageProps {
  roles: Role[];
  users: User[];
  onAddRole: (role: Omit<Role, 'id'>) => void;
  // onUpdateRole and onDeleteRole would be added for full CRUD
}

export const AdminRolesPage: React.FC<AdminRolesPageProps> = ({ roles, users, onAddRole }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModalForAdd = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleSaveRole = (roleData: Omit<Role, 'id'>) => {
    onAddRole(roleData);
    handleCloseModal();
  };
  
  const getUserCountForRole = (roleId: string) => {
      return users.filter(u => u.role === roleId).length;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-cinzel text-[--text-primary]">Roles & Permissions</h1>
          <button
            onClick={handleOpenModalForAdd}
            className="px-6 py-2 bg-[--accent] text-[--accent-foreground] font-bold rounded-full hover:bg-[--accent-hover] transition duration-300 transform hover:scale-105"
           >
              Add New Role
           </button>
      </div>
      <p className="text-[--text-muted] mb-6 max-w-2xl">
        Manage user roles to control access to different parts of the admin panel. Each role has a specific set of permissions that define what a user can see and do.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map(role => (
          <div key={role.id} className="bg-[--bg-secondary] p-6 rounded-lg shadow-lg border border-[--border-color] flex flex-col">
            <div className="flex-grow">
              <h2 className="text-xl font-bold font-cinzel text-[--accent]">{role.name}</h2>
              <p className="text-sm text-[--text-muted] mt-1 h-10">{role.description}</p>
            </div>
            <div className="border-t border-[--border-color] mt-4 pt-4 flex justify-between items-center">
                <span className="text-sm font-semibold text-[--text-primary]">{role.permissions.length} Permissions</span>
                <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded-md">{getUserCountForRole(role.id)} Users</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
          <RoleForm
            onClose={handleCloseModal}
            onSave={handleSaveRole}
          />
      )}
    </div>
  );
};