import React, { useState, FormEvent, useEffect } from 'react';
import { Transaction, Seller } from '../../types';
import { useCurrency } from '../../contexts/CurrencyContext';

interface ManualTransactionFormProps {
    sellers: Seller[];
    onClose: () => void;
    onSave: (transaction: Omit<Transaction, 'id' | 'date' | 'processedBy'>) => void;
    reversingTransaction?: Transaction | null;
}

const getInitialState = (reversingTransaction: Transaction | null | undefined): Omit<Transaction, 'id' | 'date' | 'sellerId' | 'processedBy'> & { sellerId: string } => {
    if (reversingTransaction) {
        return {
            sellerId: String(reversingTransaction.sellerId),
            type: 'Adjustment',
            amount: -reversingTransaction.amount,
            currency: reversingTransaction.currency,
            description: `Reversal of transaction ${reversingTransaction.id}. Reason: `,
            referenceId: reversingTransaction.id,
        };
    }
    return {
        type: 'Adjustment',
        amount: 0,
        currency: 'GBP',
        description: '',
        sellerId: '',
        referenceId: undefined,
    };
};


export const ManualTransactionForm: React.FC<ManualTransactionFormProps> = ({ sellers, onClose, onSave, reversingTransaction }) => {
    const [formData, setFormData] = useState(() => getInitialState(reversingTransaction));
    const { currencies, formatPrice } = useCurrency();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!formData.sellerId) {
            alert('Please select a seller.');
            return;
        }
        if (formData.description.length < 10) {
            alert('Please provide a detailed justification for this transaction (minimum 10 characters).');
            return;
        }

        const sellerName = sellers.find(s => s.id === parseInt(formData.sellerId, 10))?.name;
        const confirmationMessage = `
            Are you sure you want to process this manual transaction?
            --------------------------------------------------
            Seller: ${sellerName}
            Type: ${formData.type}
            Amount: ${formatPrice(formData.amount || 0, formData.currency)}
            Reason: ${formData.description}
            --------------------------------------------------
            This action is irreversible and will be logged.
        `;

        if (window.confirm(confirmationMessage)) {
            const { sellerId, ...rest } = formData;
            onSave({ ...rest, sellerId: parseInt(sellerId, 10) });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-[--bg-secondary] rounded-lg shadow-2xl p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold font-cinzel text-[--text-primary] mb-6">
                    {reversingTransaction ? 'Reverse Transaction' : 'Manual Transaction Entry'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="sellerId" className="block text-sm font-medium text-[--text-muted]">Seller</label>
                        <select name="sellerId" id="sellerId" value={formData.sellerId} onChange={handleChange} required disabled={!!reversingTransaction} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent] disabled:opacity-70">
                            <option value="">-- Select a Seller --</option>
                            {sellers.filter(s => s.status === 'approved').map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                             <label htmlFor="type" className="block text-sm font-medium text-[--text-muted]">Type</label>
                            <select name="type" id="type" value={formData.type} onChange={handleChange} disabled={!!reversingTransaction} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent] disabled:opacity-70">
                                <option value="Adjustment">Adjustment</option>
                                <option value="Fee">Fee</option>
                                <option value="Refund">Refund</option>
                            </select>
                        </div>
                         <div className="md:col-span-1">
                            <label htmlFor="currency" className="block text-sm font-medium text-[--text-muted]">Currency</label>
                            <select name="currency" id="currency" value={formData.currency} onChange={handleChange} disabled={!!reversingTransaction} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent] disabled:opacity-70">
                                {Object.keys(currencies).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-1">
                            <label htmlFor="amount" className="block text-sm font-medium text-[--text-muted]">Amount</label>
                            <input type="number" name="amount" id="amount" value={formData.amount} onChange={handleChange} required step="0.01" disabled={!!reversingTransaction} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent] disabled:opacity-70" placeholder="e.g., -25.00 for a fee" />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-[--text-muted]">Reason / Justification for Entry</label>
                        <textarea name="description" id="description" value={formData.description} onChange={handleChange} required minLength={10} rows={3} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md shadow-sm py-2 px-3 text-[--text-primary] focus:outline-none focus:ring-[--accent] focus:border-[--accent]" placeholder="e.g., 'Platform fee for custom storefront setup'"></textarea>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-[--bg-tertiary] text-[--text-secondary] font-semibold rounded-full hover:bg-[--border-color] transition-colors">Cancel</button>
                        <button type="submit" className="px-8 py-2 bg-[--accent] text-[--accent-foreground] font-bold rounded-full hover:bg-[--accent-hover] transition duration-300">
                             {reversingTransaction ? 'Confirm Reversal' : 'Add Transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};