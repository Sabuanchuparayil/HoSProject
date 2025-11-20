import React, { useState, FormEvent } from 'react';
import { Carrier, ShippingRate } from '../../types';

interface CarrierRatesModalProps {
    carrier: Carrier;
    onClose: () => void;
    onSave: (updatedCarrier: Carrier) => void;
}

export const CarrierRatesModal: React.FC<CarrierRatesModalProps> = ({ carrier, onClose, onSave }) => {
    const [rates, setRates] = useState<ShippingRate[]>(carrier.rates);

    const handleRateChange = (index: number, field: keyof ShippingRate, value: any) => {
        const newRates = [...rates];
        if (field === 'cost') {
            (newRates[index] as any)[field] = parseFloat(value) || 0;
        } else if (field === 'estimatedDays') {
            const [key, val] = Object.entries(value)[0];
            (newRates[index] as any)[field][key] = parseInt(val as string, 10) || 0;
        } else {
            (newRates[index] as any)[field] = value;
        }
        setRates(newRates);
    };
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave({ ...carrier, rates });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-[--bg-secondary] rounded-lg shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] flex flex-col">
                <h2 className="text-2xl font-bold font-cinzel text-[--text-primary] mb-6">Edit Rates for {carrier.name}</h2>
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-4 space-y-4">
                    {rates.map((rate, index) => (
                        <div key={index} className="bg-[--bg-tertiary]/50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div>
                                <label className="block text-sm font-medium text-[--text-muted]">Zone</label>
                                <p className="font-semibold mt-1">{rate.zone}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[--text-muted]">Method</label>
                                <p className="font-semibold mt-1">{rate.method}</p>
                            </div>
                            <div>
                                <label htmlFor={`cost-${index}`} className="block text-sm font-medium text-[--text-muted]">Cost</label>
                                <input id={`cost-${index}`} type="number" step="0.01" value={rate.cost} onChange={(e) => handleRateChange(index, 'cost', e.target.value)} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3"/>
                            </div>
                            <div className="flex gap-2">
                                <div>
                                    <label htmlFor={`min-days-${index}`} className="block text-sm font-medium text-[--text-muted]">Min Days</label>
                                    <input id={`min-days-${index}`} type="number" value={rate.estimatedDays.min} onChange={(e) => handleRateChange(index, 'estimatedDays', {min: e.target.value})} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3"/>
                                </div>
                                <div>
                                    <label htmlFor={`max-days-${index}`} className="block text-sm font-medium text-[--text-muted]">Max Days</label>
                                    <input id={`max-days-${index}`} type="number" value={rate.estimatedDays.max} onChange={(e) => handleRateChange(index, 'estimatedDays', {max: e.target.value})} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3"/>
                                </div>
                            </div>
                        </div>
                    ))}
                </form>
                <div className="flex justify-end gap-4 pt-6 border-t border-[--border-color] mt-6">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-[--bg-tertiary] text-[--text-secondary] font-semibold rounded-full hover:bg-[--border-color] transition-colors">Cancel</button>
                    <button type="submit" onClick={handleSubmit} className="px-8 py-2 bg-[--accent] text-[--accent-foreground] font-bold rounded-full hover:bg-[--accent-hover] transition duration-300">Save Changes</button>
                </div>
            </div>
        </div>
    );
};
