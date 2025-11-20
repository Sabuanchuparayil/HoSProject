import React, { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { UserAddress, ShippingAddress } from '../types';

const initialAddressState: Omit<UserAddress, 'id' | 'isDefault'> = {
    firstName: '',
    lastName: '',
    addressLine1: '',
    city: '',
    postalCode: '',
    country: 'GB'
};

const AddressFormModal: React.FC<{
    address: Omit<UserAddress, 'id' | 'isDefault'> & { id?: number } | null,
    onSave: (address: Omit<UserAddress, 'id' | 'isDefault'> & { id?: number }) => void,
    onClose: () => void,
}> = ({ address, onSave, onClose }) => {
    const [formData, setFormData] = useState(address || initialAddressState);
    const isEditing = !!address;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-[--bg-secondary] rounded-lg shadow-2xl p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold font-cinzel text-[--text-primary] mb-6">{isEditing ? 'Edit Address' : 'Add New Address'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required className="w-full bg-[--bg-primary] border border-[--border-color] rounded-md p-2" />
                        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required className="w-full bg-[--bg-primary] border border-[--border-color] rounded-md p-2" />
                    </div>
                    <input type="text" name="addressLine1" placeholder="Address" value={formData.addressLine1} onChange={handleChange} required className="w-full bg-[--bg-primary] border border-[--border-color] rounded-md p-2" />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required className="w-full bg-[--bg-primary] border border-[--border-color] rounded-md p-2" />
                        <input type="text" name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} required className="w-full bg-[--bg-primary] border border-[--border-color] rounded-md p-2" />
                         <select name="country" value={formData.country} onChange={handleChange} className="w-full bg-[--bg-primary] border border-[--border-color] rounded-md p-2">
                            <option value="GB">United Kingdom</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-[--bg-tertiary] text-[--text-secondary] font-semibold rounded-full hover:bg-[--border-color]">Cancel</button>
                        <button type="submit" className="px-8 py-2 bg-[--accent] text-[--accent-foreground] font-bold rounded-full hover:bg-[--accent-hover]">Save Address</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export const ProfilePage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState('');
    const [feedback, setFeedback] = useState('');
    const [addresses, setAddresses] = useState<UserAddress[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
    
    // State for password change
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordFeedback, setPasswordFeedback] = useState({ message: '', type: '' });

    useEffect(() => {
        if (user) {
            setName(user.name);
            setAddresses(user.addresses || []);
        }
    }, [user]);

    if (!user) {
        return <p>Loading...</p>;
    }
    
    const handleUpdateUser = async (updatedData: Partial<typeof user>) => {
        try {
            await updateUser({ ...user, ...updatedData });
            return true; // Indicate success
        } catch (error) {
            return false; // Indicate failure
        }
    };

    const handleSaveChanges = async () => {
        if (user && name.trim() !== '') {
            const success = await handleUpdateUser({ name });
            if (success) {
                setFeedback('Profile updated successfully!');
                setTimeout(() => setFeedback(''), 3000);
            } else {
                 setFeedback('Failed to update profile.');
                 setTimeout(() => setFeedback(''), 3000);
            }
        }
    };
    
    const handleChangePassword = async (e: FormEvent) => {
        e.preventDefault();
        setPasswordFeedback({ message: '', type: '' });

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordFeedback({ message: 'All fields are required.', type: 'error' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordFeedback({ message: 'New passwords do not match.', type: 'error' });
            return;
        }

        if (user.password !== currentPassword) {
            setPasswordFeedback({ message: 'Incorrect current password.', type: 'error' });
            return;
        }
        
        const success = await handleUpdateUser({ password: newPassword });

        if (success) {
            setPasswordFeedback({ message: 'Password changed successfully!', type: 'success' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
             setPasswordFeedback({ message: 'Failed to change password. Please try again.', type: 'error' });
        }
    };

    const handleSetDefault = async (addressId: number) => {
        const newAddresses = addresses.map(addr => ({ ...addr, isDefault: addr.id === addressId }));
        await handleUpdateUser({ addresses: newAddresses });
    };

    const handleDeleteAddress = async (addressId: number) => {
        const newAddresses = addresses.filter(addr => addr.id !== addressId);
        await handleUpdateUser({ addresses: newAddresses });
    };
    
    const handleSaveAddress = async (addressData: Omit<UserAddress, 'id' | 'isDefault'> & { id?: number }) => {
        let newAddresses = [...addresses];
        if (addressData.id) { // Editing
            newAddresses = newAddresses.map(addr => addr.id === addressData.id ? { ...addr, ...addressData } as UserAddress : addr);
        } else { // Adding
            const newAddress: UserAddress = {
                ...addressData,
                id: Date.now(),
                isDefault: newAddresses.length === 0,
            };
            newAddresses.push(newAddress);
        }
        await handleUpdateUser({ addresses: newAddresses });
        setIsModalOpen(false);
        setEditingAddress(null);
    };

    const handleOpenAddModal = () => {
        setEditingAddress(null);
        setIsModalOpen(true);
    };
    
    const handleOpenEditModal = (address: UserAddress) => {
        setEditingAddress(address);
        setIsModalOpen(true);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-cinzel font-bold text-[--accent] mb-8">My Profile</h1>
                <div className="bg-[--bg-secondary] p-8 rounded-lg shadow-xl space-y-8">
                    <div>
                        <h2 className="text-2xl font-cinzel font-semibold text-[--text-primary] mb-4 uppercase">Account Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[--text-muted]">Full Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[--text-muted]">Email Address</label>
                                <input type="email" value={user.email} disabled className="mt-1 block w-full bg-gray-700 border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-gray-400 cursor-not-allowed" />
                            </div>
                            <div className="flex justify-end items-center gap-4">
                                {feedback && <p className="text-sm text-green-400">{feedback}</p>}
                                <button onClick={handleSaveChanges} className="px-6 py-2 bg-[--accent] text-[--bg-primary] font-bold rounded-full hover:bg-[--accent-hover] transition duration-300">Save Changes</button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="border-t border-[--border-color] pt-8">
                        <h2 className="text-2xl font-cinzel font-semibold text-[--text-primary] mb-4 uppercase">Change Password</h2>
                        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                            <div>
                                <label className="block text-sm font-medium text-[--text-muted]">Current Password</label>
                                <input 
                                    type="password" 
                                    value={currentPassword} 
                                    onChange={(e) => setCurrentPassword(e.target.value)} 
                                    className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]" 
                                    autoComplete="current-password"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-[--text-muted]">New Password</label>
                                <input 
                                    type="password" 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                    className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]" 
                                    autoComplete="new-password"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-[--text-muted]">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]" 
                                    autoComplete="new-password"
                                />
                            </div>
                            <div className="flex justify-end items-center gap-4">
                                {passwordFeedback.message && (
                                    <p className={`text-sm ${passwordFeedback.type === 'success' ? 'text-green-400' : 'text-red-500'}`}>
                                        {passwordFeedback.message}
                                    </p>
                                )}
                                <button type="submit" className="px-6 py-2 bg-[--accent] text-[--bg-primary] font-bold rounded-full hover:bg-[--accent-hover] transition duration-300">Change Password</button>
                            </div>
                        </form>
                    </div>

                    <div className="border-t border-[--border-color] pt-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-cinzel font-semibold text-[--text-primary] uppercase">Address Book</h2>
                            <button onClick={handleOpenAddModal} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition text-sm">Add New Address</button>
                        </div>
                        <div className="space-y-4">
                            {addresses.length === 0 ? (
                                <p className="text-[--text-muted]">You have not saved any addresses yet.</p>
                            ) : (
                                addresses.map(addr => (
                                    <div key={addr.id} className={`p-4 rounded-lg border-2 ${addr.isDefault ? 'bg-[--accent]/10 border-[--accent]' : 'bg-[--bg-primary] border-[--border-color]'}`}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold">{addr.firstName} {addr.lastName}</p>
                                                <p className="text-sm text-[--text-muted]">{addr.addressLine1}, {addr.city}, {addr.postalCode}</p>
                                            </div>
                                            {addr.isDefault && <span className="text-xs font-bold text-[--accent] bg-[--accent]/20 px-2 py-1 rounded-full">Default</span>}
                                        </div>
                                        <div className="flex gap-4 mt-3 pt-3 border-t border-[--border-color]/50 text-sm font-semibold">
                                            <button onClick={() => handleOpenEditModal(addr)} className="text-[--accent] hover:text-[--accent-hover]">Edit</button>
                                            <button onClick={() => handleDeleteAddress(addr.id)} disabled={addr.isDefault} className="text-red-500 hover:text-red-400 disabled:text-gray-500 disabled:cursor-not-allowed">Delete</button>
                                            {!addr.isDefault && <button onClick={() => handleSetDefault(addr.id)} className="ml-auto text-blue-400 hover:text-blue-300">Set as Default</button>}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    
                    <div className="border-t border-[--border-color] pt-8">
                        <h2 className="text-2xl font-cinzel font-semibold text-[--text-primary] mb-4 uppercase">Loyalty Program</h2>
                        <div className="bg-gradient-to-r from-yellow-400/20 to-transparent p-4 rounded-lg flex items-center gap-4">
                            <span className="text-4xl">✨</span>
                            <div>
                                <p className="text-[--text-muted]">Loyalty Points</p>
                                <p className="text-2xl font-bold text-[--text-primary]">{user.loyaltyPoints} Points</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-[--border-color] pt-8">
                        <h2 className="text-2xl font-cinzel font-semibold text-[--text-primary] mb-4 uppercase">Order History</h2>
                        <p className="text-[--text-muted]">You can view all your past orders here.</p>
                        <div className="mt-4">
                            <Link to="/orders" className="font-medium text-[--accent] hover:text-[--accent-hover]">View all orders &rarr;</Link>
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && <AddressFormModal address={editingAddress} onSave={handleSaveAddress} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};