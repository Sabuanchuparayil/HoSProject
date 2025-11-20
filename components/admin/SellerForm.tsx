import React, { useState, FormEvent } from 'react';
import { Seller } from '../../types';
import { TAXONOMY_DATA } from '../../data/taxonomy';

interface SellerFormProps {
    seller?: Seller;
    onClose: () => void;
    onSave: (sellerData: Seller | Pick<Seller, 'name' | 'businessName' | 'contactEmail' | 'type' | 'status'>) => void;
}

const initialSellerState: Pick<Seller, 'name' | 'businessName' | 'contactEmail' | 'type' | 'status' | 'businessAddress' | 'productCategories'> = {
    name: '',
    businessName: '',
    contactEmail: '',
    type: 'B2C',
    status: 'approved',
    businessAddress: {
        addressLine1: '',
        city: '',
        postalCode: '',
        country: 'GB'
    },
    productCategories: [],
};

export const SellerForm: React.FC<SellerFormProps> = ({ seller, onClose, onSave }) => {
    const [formData, setFormData] = useState(() => {
        if (seller) {
            return {
                ...initialSellerState,
                ...seller,
                businessAddress: seller.businessAddress || initialSellerState.businessAddress,
                productCategories: seller.productCategories || initialSellerState.productCategories,
            };
        }
        return initialSellerState;
    });

    const isEditing = seller !== undefined;
    const fandoms = Object.keys(TAXONOMY_DATA);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';

        setFormData(prev => ({
            ...prev,
            [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            businessAddress: {
                ...(prev.businessAddress || initialSellerState.businessAddress),
                [name]: value,
            }
        }));
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const categories = prev.productCategories || [];
            if (checked) {
                return { ...prev, productCategories: [...categories, value] };
            } else {
                return { ...prev, productCategories: categories.filter(cat => cat !== value) };
            }
        });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-[--bg-secondary] rounded-lg shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] flex flex-col">
                <h2 className="text-2xl font-bold font-cinzel text-[--text-primary] mb-6">{isEditing ? 'Manage Seller' : 'Add New Seller'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4 flex-grow overflow-y-auto pr-2">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-[--text-muted]">Storefront Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]" />
                    </div>
                    <div>
                        <label htmlFor="businessName" className="block text-sm font-medium text-[--text-muted]">Business Name</label>
                        <input type="text" name="businessName" id="businessName" value={formData.businessName} onChange={handleChange} required className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]" />
                    </div>
                    <div>
                        <label htmlFor="contactEmail" className="block text-sm font-medium text-[--text-muted]">Contact Email</label>
                        <input type="email" name="contactEmail" id="contactEmail" value={formData.contactEmail} onChange={handleChange} required className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]" />
                    </div>

                    <div className="space-y-2 pt-2">
                         <label className="block text-sm font-medium text-[--text-muted]">Business Address</label>
                         <input type="text" name="addressLine1" placeholder="Address Line 1" value={formData.businessAddress?.addressLine1 || ''} onChange={handleAddressChange} required className="block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3"/>
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input type="text" name="city" placeholder="City" value={formData.businessAddress?.city || ''} onChange={handleAddressChange} required className="block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3"/>
                            <input type="text" name="postalCode" placeholder="Postal Code" value={formData.businessAddress?.postalCode || ''} onChange={handleAddressChange} required className="block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3"/>
                            <select name="country" value={formData.businessAddress?.country || 'GB'} onChange={handleAddressChange} required className="w-full bg-[--bg-primary] border border-[--border-color] rounded-md p-2 text-[--text-primary]">
                                <option value="GB">United Kingdom</option>
                                <option value="US">United States</option>
                                <option value="CA">Canada</option>
                            </select>
                         </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-[--text-muted]">Seller Type</label>
                            <select name="type" id="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]">
                                <option value="B2C">B2C</option>
                                <option value="Wholesale">Wholesale</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-[--text-muted]">Status</label>
                            <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]">
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="block text-sm font-medium text-[--text-muted]">Product Categories</label>
                        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 bg-[--bg-primary] rounded-md border border-[--border-color]">
                            {fandoms.map(fandom => (
                                <label key={fandom} htmlFor={`admin-category-${fandom}`} className="flex items-center p-2 rounded-md hover:bg-[--bg-tertiary] cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id={`admin-category-${fandom}`}
                                        value={fandom}
                                        checked={formData.productCategories.includes(fandom)}
                                        onChange={handleCategoryChange}
                                        className="h-4 w-4 rounded border-gray-500 text-[--accent] focus:ring-[--accent]"
                                    />
                                    <span className="ml-2 text-sm text-[--text-secondary]">{fandom}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex items-center pt-2">
                            <input id="isVerified" name="isVerified" type="checkbox" checked={(formData as Seller).isVerified} onChange={handleChange} className="h-4 w-4 rounded border-[--border-color] text-[--accent] focus:ring-[--accent] bg-[--bg-primary]" />
                            <label htmlFor="isVerified" className="ml-3 block text-sm font-medium text-[--text-muted]">
                                Verified Seller
                            </label>
                        </div>
                    )}
                </form>
                <div className="flex justify-end gap-4 pt-4 mt-4 border-t border-[--border-color]">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-[--bg-tertiary] text-[--text-secondary] font-semibold rounded-full hover:bg-[--border-color] transition-colors">Cancel</button>
                    <button type="submit" onClick={handleSubmit} className="px-8 py-2 bg-[--accent] text-[--accent-foreground] font-bold rounded-full hover:bg-[--accent-hover] transition duration-300">{isEditing ? 'Save Changes' : 'Add Seller'}</button>
                </div>
            </div>
        </div>
    );
};