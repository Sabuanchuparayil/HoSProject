import React, { useState, FormEvent } from 'react';
import { Role, Permission } from '../../types';
import { PERMISSION_MODULES } from '../../data/permissions';

interface RoleFormProps {
    role?: Role;
    onClose: () => void;
    onSave: (roleData: Omit<Role, 'id'>) => void;
}

const initialRoleState: Omit<Role, 'id'> = {
    name: '',
    description: '',
    permissions: [],
};

export const RoleForm: React.FC<RoleFormProps> = ({ role, onClose, onSave }) => {
    const [formData, setFormData] = useState(role || initialRoleState);
    const [selectedPermissions, setSelectedPermissions] = useState<Set<Permission>>(new Set(role?.permissions || []));
    const isEditing = role !== undefined;

    const handlePermissionChange = (permissionId: Permission, isChecked: boolean) => {
        const newPermissions = new Set(selectedPermissions);
        if (isChecked) {
            newPermissions.add(permissionId);
        } else {
            newPermissions.delete(permissionId);
        }
        setSelectedPermissions(newPermissions);
    };

    const handleSelectAllModule = (modulePermissions: Permission[], shouldSelect: boolean) => {
        const newPermissions = new Set(selectedPermissions);
        modulePermissions.forEach(p => {
            if (shouldSelect) newPermissions.add(p);
            else newPermissions.delete(p);
        });
        setSelectedPermissions(newPermissions);
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            permissions: Array.from(selectedPermissions),
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-[--bg-secondary] rounded-lg shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] flex flex-col">
                <h2 className="text-2xl font-bold font-cinzel text-[--text-primary] mb-6">{isEditing ? 'Edit Role' : 'Add New Role'}</h2>
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-4 space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-[--text-muted]">Role Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required placeholder="e.g., Inventory Manager" className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-[--text-muted]">Description</label>
                        <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows={2} placeholder="A brief description of this role's responsibilities." className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]"></textarea>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-[--accent] font-cinzel mb-4">Permissions</h3>
                        <div className="space-y-6">
                            {Object.entries(PERMISSION_MODULES).map(([moduleName, permissions]) => {
                                const modulePermissionIds = permissions.map(p => p.id);
                                const allSelected = modulePermissionIds.every(p => selectedPermissions.has(p));
                                
                                return (
                                    <fieldset key={moduleName} className="bg-[--bg-tertiary]/50 p-4 rounded-lg">
                                        <legend className="font-semibold text-[--text-primary] flex justify-between w-full items-center">
                                            <span>{moduleName}</span>
                                            <button type="button" onClick={() => handleSelectAllModule(modulePermissionIds, !allSelected)} className="text-xs font-semibold text-[--accent] hover:underline">
                                                {allSelected ? 'Deselect All' : 'Select All'}
                                            </button>
                                        </legend>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                            {permissions.map(permission => (
                                                <label key={permission.id} htmlFor={permission.id} className="flex items-start p-3 bg-[--bg-primary] rounded-md hover:bg-[--bg-tertiary] cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        id={permission.id}
                                                        checked={selectedPermissions.has(permission.id)}
                                                        onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                                                        className="h-5 w-5 rounded border-gray-500 text-[--accent] focus:ring-[--accent] bg-transparent"
                                                    />
                                                    <div className="ml-3 text-sm">
                                                        <span className="font-medium text-[--text-secondary]">{permission.label}</span>
                                                        <p className="text-[--text-muted]">{permission.description}</p>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </fieldset>
                                );
                            })}
                        </div>
                    </div>
                </form>
                 <div className="flex justify-end gap-4 pt-6 border-t border-[--border-color] mt-6">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-[--bg-tertiary] text-[--text-secondary] font-semibold rounded-full hover:bg-[--border-color] transition-colors">Cancel</button>
                    <button type="button" onClick={handleSubmit} className="px-8 py-2 bg-[--accent] text-[--accent-foreground] font-bold rounded-full hover:bg-[--accent-hover] transition duration-300">{isEditing ? 'Save Changes' : 'Create Role'}</button>
                </div>
            </div>
        </div>
    );
};