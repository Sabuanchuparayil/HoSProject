import React, { useState, FormEvent } from 'react';
import { User, ShippingAddress, UserAddress } from '../../types';

interface UserFormProps {
    user?: User;
    onClose: () => void;
    onSave: (user: User | Omit<User, 'id' | 'loyaltyPoints' | 'createdAt'>) => void;
}

const initialUserState: Omit<User, 'id' | 'loyaltyPoints' | 'createdAt' | 'addresses'> = {
    name: '',
    email: '',
    password: '',
    role: 'customer',
    phone: '',
};

const initialAddressState: Omit<UserAddress, 'id' | 'isDefault'> = {
    firstName: '',
    lastName: '',
    addressLine1: '',
    city: '',
    postalCode: '',
    country: 'GB'
};


export const UserForm: React.FC<UserFormProps> = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState(user || initialUserState);
    const [addressData, setAddressData] = useState(() => {
        const defaultAddress = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0];
        return defaultAddress || initialAddressState;
    });

    const isEditing = user !== undefined;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAddressData(prev => ({ 
            ...prev,
            [name]: value 
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const finalUser = { ...formData };
        
        // When saving, sync name to address firstName/lastName if they are empty
        if (!addressData.firstName && finalUser.name) {
            addressData.firstName = finalUser.name.split(' ')[0] || '';
            addressData.lastName = finalUser.name.split(' ').slice(1).join(' ') || '';
        }

        let newAddresses: UserAddress[] = [...(user?.addresses || [])];
        const addressId = (addressData as UserAddress).id;

        if (addressId && newAddresses.some(a => a.id === addressId)) {
            // Update existing default/first address
            const indexToUpdate = newAddresses.findIndex(a => a.id === addressId);
            newAddresses[indexToUpdate] = { ...newAddresses[indexToUpdate], ...addressData };
        } else if (addressData.addressLine1) {
            // Add as a new address if one didn't exist before
            newAddresses.push({ ...addressData, id: Date.now(), isDefault: true });
        }
        
        onSave({ ...finalUser, addresses: newAddresses });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-[--bg-secondary] rounded-lg shadow-2xl p-8 w-full max-w-2xl max-h-full overflow-y-auto">
                <h2 className="text-2xl font-bold font-cinzel text-[--text-primary] mb-6">{isEditing ? 'Edit User' : 'Add New User'}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Account Info */}
                    <div className="bg-[--bg-tertiary]/50 p-4 rounded-lg space-y-4">
                         <h3 className="font-semibold text-[--accent]">Account Information</h3>
                         <div>
                            <label htmlFor="name" className="block text-sm font-medium text-[--text-muted]">Full Name</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]" />
                        </div>
                         <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[--text-muted]">Email</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]" />
                        </div>
                        {!isEditing && (
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-[--text-muted]">Password</label>
                                <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]" />
                            </div>
                        )}
                         <div>
                            <label htmlFor="role" className="block text-sm font-medium text-[--text-muted]">Role</label>
                            <select name="role" id="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]">
                                <option value="customer">Customer</option>
                                <option value="seller">Seller</option>
                                <option value="admin">Admin</option>
                                <option value="warehouse_operative">Warehouse Operative</option>
                                <option value="logistics_coordinator">Logistics Coordinator</option>
                                <option value="catalog_manager">Catalog Manager</option>
                                <option value="customer_support_lead">Customer Support Lead</option>
                                <option value="support_agent">Support Agent</option>
                                <option value="content_moderator">Content Moderator</option>
                                <option value="marketing_manager">Marketing Manager</option>
                                <option value="finance_manager">Finance Manager</option>
                                <option value="accountant">Accountant</option>
                                <option value="order_manager">Order Manager</option>
                                <option value="shipping_coordinator">Shipping Coordinator</option>
                            </select>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-[--bg-tertiary]/50 p-4 rounded-lg space-y-4">
                         <h3 className="font-semibold text-[--accent]">Contact Information</h3>
                         <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-[--text-muted]">Phone</label>
                            <input type="tel" name="phone" id="phone" value={formData.phone || ''} onChange={handleChange} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]" />
                        </div>
                        <div className="space-y-2">
                             <label className="block text-sm font-medium text-[--text-muted]">Default Address</label>
                             <input type="text" name="addressLine1" placeholder="Address Line 1" value={addressData.addressLine1 || ''} onChange={handleAddressChange} className="block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3"/>
                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <input type="text" name="city" placeholder="City" value={addressData.city || ''} onChange={handleAddressChange} className="block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3"/>
                                <input type="text" name="postalCode" placeholder="Postal Code" value={addressData.postalCode || ''} onChange={handleAddressChange} className="block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3"/>
                                <select name="country" value={addressData.country || 'GB'} onChange={handleAddressChange} className="w-full bg-[--bg-primary] border border-[--border-color] rounded-md p-2 text-[--text-primary]">
                                    <option value="GB">United Kingdom</option>
                                    <option value="US">United States</option>
                                    <option value="CA">Canada</option>
                                </select>
                             </div>
                        </div>
                    </div>


                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-[--bg-tertiary] text-[--text-secondary] font-semibold rounded-full hover:bg-[--border-color] transition-colors">Cancel</button>
                        <button type="submit" className="px-8 py-2 bg-[--accent] text-[--accent-foreground] font-bold rounded-full hover:bg-[--accent-hover] transition duration-300">{isEditing ? 'Save Changes' : 'Add User'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};