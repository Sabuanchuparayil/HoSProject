import React, { useState, FormEvent, useEffect } from 'react';
import { Promotion } from '../../types';

interface PromotionFormProps {
    promotion?: Promotion;
    onClose: () => void;
    onAddPromotion: (promotion: Omit<Promotion, 'id'>) => void;
    onUpdatePromotion: (promotion: Promotion) => void;
}

// FIX: Added missing properties to satisfy the Omit<Promotion, 'id'> type and support new features.
const initialPromotionState: Omit<Promotion, 'id'> = {
    code: '',
    description: '',
    type: 'PERCENTAGE',
    value: 0,
    isActive: true,
    usageCount: 0,
    minSpend: undefined,
    startDate: undefined,
    endDate: undefined,
    maxUsage: undefined,
    applicableCategory: undefined,
    applicableProductIds: undefined,
};

export const PromotionForm: React.FC<PromotionFormProps> = ({ promotion, onClose, onAddPromotion, onUpdatePromotion }) => {
    const [formData, setFormData] = useState(() => {
        if (promotion) {
            return {
                ...initialPromotionState,
                ...promotion,
                applicableProductIds: promotion.applicableProductIds ? promotion.applicableProductIds.join(', ') : '',
            };
        }
        return { ...initialPromotionState, applicableProductIds: '' };
    });
    
    const isEditing = promotion !== undefined;

    useEffect(() => {
        // When type changes, reset irrelevant fields
        if (formData.type === 'FREE_SHIPPING') {
            setFormData(prev => ({ ...prev, value: 0 }));
        }
        if (formData.type !== 'PRODUCT_SPECIFIC_PERCENTAGE') {
            setFormData(prev => ({ ...prev, applicableCategory: '', applicableProductIds: '' }));
        }
    }, [formData.type]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';

        setFormData(prev => ({
            ...prev,
            [name]: isCheckbox ? (e.target as HTMLInputElement).checked : (name === 'value' || name === 'minSpend' || name === 'maxUsage' ? (value ? Number(value) : undefined) : value),
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        const stringToIdArray = (ids: string | undefined) => {
            if (!ids) return [];
            return ids.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        };
        
        const finalData = { 
            ...formData, 
            applicableProductIds: stringToIdArray(formData.applicableProductIds as any) 
        };

        if (isEditing) {
            onUpdatePromotion(finalData as Promotion);
        } else {
            onAddPromotion(finalData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-[--bg-secondary] rounded-lg shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] flex flex-col">
                <h2 className="text-2xl font-bold font-cinzel text-[--text-primary] mb-6">{isEditing ? 'Edit Promotion' : 'Add New Promotion'}</h2>
                <form onSubmit={handleSubmit} id="promotion-form" className="flex-grow overflow-y-auto pr-2 space-y-4">
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-[--text-muted]">Promo Code</label>
                        <input type="text" name="code" id="code" value={formData.code} onChange={handleChange} required className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-[--text-muted]">Description</label>
                        <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows={2} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]"></textarea>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-[--text-muted]">Type</label>
                            <select name="type" id="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]">
                                <option value="PERCENTAGE">Percentage (%)</option>
                                <option value="FIXED_AMOUNT">Fixed Amount</option>
                                <option value="FREE_SHIPPING">Free Shipping</option>
                                <option value="PRODUCT_SPECIFIC_PERCENTAGE">Targeted Percentage (%)</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="value" className="block text-sm font-medium text-[--text-muted]">Value</label>
                            <input type="number" name="value" id="value" value={formData.value || ''} onChange={handleChange} required={formData.type !== 'FREE_SHIPPING'} disabled={formData.type === 'FREE_SHIPPING'} min="0" step="0.01" className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent] disabled:bg-gray-700 disabled:text-gray-400" />
                        </div>
                    </div>
                    
                     {formData.type === 'PRODUCT_SPECIFIC_PERCENTAGE' && (
                        <div className="bg-[--bg-tertiary]/50 p-4 rounded-lg space-y-4">
                            <h3 className="font-semibold text-[--accent]">Targeting</h3>
                             <p className="text-xs text-[--text-muted]">Apply this discount only to specific products. Use one option below.</p>
                             <div>
                                <label htmlFor="applicableCategory" className="block text-sm font-medium text-[--text-muted]">Applicable Category</label>
                                <input type="text" name="applicableCategory" id="applicableCategory" value={formData.applicableCategory || ''} onChange={handleChange} placeholder="e.g., Wands" className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3" />
                            </div>
                            <div>
                                <label htmlFor="applicableProductIds" className="block text-sm font-medium text-[--text-muted]">Applicable Product IDs</label>
                                <input type="text" name="applicableProductIds" id="applicableProductIds" value={formData.applicableProductIds || ''} onChange={handleChange} placeholder="e.g., 1, 9, 14" className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3" />
                            </div>
                        </div>
                    )}

                     <div className="bg-[--bg-tertiary]/50 p-4 rounded-lg space-y-4">
                         <h3 className="font-semibold text-[--accent]">Conditions & Limits</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="minSpend" className="block text-sm font-medium text-[--text-muted]">Minimum Spend (optional)</label>
                                <input type="number" name="minSpend" id="minSpend" value={formData.minSpend || ''} onChange={handleChange} placeholder="e.g., 50" min="0" step="0.01" className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3" />
                            </div>
                            <div>
                                <label htmlFor="maxUsage" className="block text-sm font-medium text-[--text-muted]">Max Total Usage (optional)</label>
                                <input type="number" name="maxUsage" id="maxUsage" value={formData.maxUsage || ''} onChange={handleChange} placeholder="e.g., 100" min="1" step="1" className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-[--bg-tertiary]/50 p-4 rounded-lg space-y-4">
                        <h3 className="font-semibold text-[--accent]">Scheduling (optional)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-[--text-muted]">Start Date</label>
                                <input type="date" name="startDate" id="startDate" value={formData.startDate || ''} onChange={handleChange} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3" />
                            </div>
                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-[--text-muted]">End Date</label>
                                <input type="date" name="endDate" id="endDate" value={formData.endDate || ''} onChange={handleChange} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input id="isActive" name="isActive" type="checkbox" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 rounded border-[--border-color] text-[--accent] focus:ring-[--accent] bg-[--bg-primary]" />
                        <label htmlFor="isActive" className="ml-3 block text-sm font-medium text-[--text-muted]">Active</label>
                    </div>
                </form>

                <div className="flex justify-end gap-4 pt-4 border-t border-[--border-color] mt-auto">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-[--bg-tertiary] text-[--text-secondary] font-semibold rounded-full hover:bg-[--border-color] transition-colors">Cancel</button>
                    <button type="submit" form="promotion-form" className="px-8 py-2 bg-[--accent] text-[--accent-foreground] font-bold rounded-full hover:bg-[--accent-hover] transition duration-300">{isEditing ? 'Save Changes' : 'Add Promotion'}</button>
                </div>
            </div>
        </div>
    );
};
