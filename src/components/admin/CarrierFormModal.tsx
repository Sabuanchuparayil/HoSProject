import React, { useState, FormEvent } from 'react';
import { Carrier, ShippingRate, ShippingZone } from '../../types';

interface CarrierFormModalProps {
    onClose: () => void;
    onSave: (newCarrier: Carrier) => void;
}

const initialRate: Omit<ShippingRate, 'estimatedDays'> & { estimatedDays: { min: string, max: string } } = {
    method: 'Standard',
    zone: 'UK',
    cost: 0,
    estimatedDays: { min: '', max: '' }
};

export const CarrierFormModal: React.FC<CarrierFormModalProps> = ({ onClose, onSave }) => {
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [rates, setRates] = useState<Array<Omit<ShippingRate, 'estimatedDays'> & { estimatedDays: { min: string, max: string } }>>([initialRate]);

    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Enforce slug-like format for ID
        const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
        setId(value);
    };

    const handleRateChange = (index: number, field: keyof ShippingRate, value: any) => {
        const newRates = [...rates];
        if (field === 'cost') {
            (newRates[index] as any)[field] = value;
        } else if (field === 'estimatedDays') {
            const [key, val] = Object.entries(value)[0];
            (newRates[index] as any)[field][key] = val;
        } else {
            (newRates[index] as any)[field] = value;
        }
        setRates(newRates);
    };

    const addRate = () => {
        setRates([...rates, { ...initialRate }]);
    };

    const removeRate = (index: number) => {
        setRates(rates.filter((_, i) => i !== index));
    };
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (rates.length === 0) {
            alert('A carrier must have at least one shipping rate.');
            return;
        }

        const formattedRates: ShippingRate[] = rates.map(r => ({
            ...r,
            cost: parseFloat(r.cost as any) || 0,
            estimatedDays: {
                min: parseInt(r.estimatedDays.min, 10) || 0,
                max: parseInt(r.estimatedDays.max, 10) || 0,
            }
        }));

        const newCarrier: Carrier = { id, name, rates: formattedRates };
        onSave(newCarrier);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-[--bg-secondary] rounded-lg shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] flex flex-col">
                <h2 className="text-2xl font-bold font-cinzel text-[--text-primary] mb-6">Add New Carrier</h2>
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-[--text-muted]">Carrier Name</label>
                            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3"/>
                        </div>
                        <div>
                            <label htmlFor="id" className="block text-sm font-medium text-[--text-muted]">Carrier ID</label>
                            <input id="id" type="text" value={id} onChange={handleIdChange} required placeholder="e.g., my-carrier-id" className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3"/>
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold font-cinzel text-[--accent] pt-4 border-t border-[--border-color]">Shipping Rates</h3>
                    {rates.map((rate, index) => (
                        <div key={index} className="bg-[--bg-tertiary]/50 p-4 rounded-lg grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
                            <div>
                                <label className="block text-xs font-medium text-[--text-muted]">Zone</label>
                                <select value={rate.zone} onChange={(e) => handleRateChange(index, 'zone', e.target.value)} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3 text-sm">
                                    {(['UK', 'EU', 'NA', 'ROW'] as ShippingZone[]).map(z => <option key={z} value={z}>{z}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[--text-muted]">Method</label>
                                <select value={rate.method} onChange={(e) => handleRateChange(index, 'method', e.target.value)} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3 text-sm">
                                    <option value="Standard">Standard</option>
                                    <option value="Express">Express</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-xs font-medium text-[--text-muted]">Cost</label>
                                <input type="number" step="0.01" value={rate.cost} onChange={(e) => handleRateChange(index, 'cost', e.target.value)} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3 text-sm"/>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-medium text-[--text-muted]">Min Days</label>
                                    <input type="number" value={rate.estimatedDays.min} onChange={(e) => handleRateChange(index, 'estimatedDays', {min: e.target.value})} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3 text-sm"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[--text-muted]">Max Days</label>
                                    <input type="number" value={rate.estimatedDays.max} onChange={(e) => handleRateChange(index, 'estimatedDays', {max: e.target.value})} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3 text-sm"/>
                                </div>
                            </div>
                            <div className="text-right">
                                {rates.length > 1 && <button type="button" onClick={() => removeRate(index)} className="text-red-500 hover:text-red-400 text-sm font-semibold">Remove</button>}
                            </div>
                        </div>
                    ))}
                     <button type="button" onClick={addRate} className="text-sm font-semibold text-[--accent] hover:text-[--accent-hover]">+ Add Rate</button>
                </form>
                <div className="flex justify-end gap-4 pt-6 border-t border-[--border-color] mt-6">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-[--bg-tertiary] text-[--text-secondary] font-semibold rounded-full hover:bg-[--border-color] transition-colors">Cancel</button>
                    <button type="submit" form="carrier-form" onClick={handleSubmit} className="px-8 py-2 bg-[--accent] text-[--accent-foreground] font-bold rounded-full hover:bg-[--accent-hover] transition duration-300">Save Carrier</button>
                </div>
            </div>
        </div>
    );
};