import React, { useState } from 'react';
import { Order, ReturnReasonCode, ReturnRequest } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { RETURN_REASONS } from '../data/reasons';

interface ReturnRequestModalProps {
    order: Order;
    onClose: () => void;
    onSubmit: (request: {
        orderId: string;
        items: { productId: number; quantity: number }[];
        reasonCode: ReturnReasonCode;
        reasonDetail: string;
    }) => void;
}

export const ReturnRequestModal: React.FC<ReturnRequestModalProps> = ({ order, onClose, onSubmit }) => {
    const { t } = useLanguage();
    const [selectedItems, setSelectedItems] = useState<{ [productId: number]: number }>({});
    const [reasonCode, setReasonCode] = useState<ReturnReasonCode>('OTHER');
    const [reasonDetail, setReasonDetail] = useState('');

    const handleQuantityChange = (productId: number, maxQuantity: number, newQuantity: number) => {
        if (newQuantity >= 0 && newQuantity <= maxQuantity) {
            setSelectedItems(prev => ({ ...prev, [productId]: newQuantity }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const itemsToReturn = Object.entries(selectedItems)
            .filter(([, quantity]) => Number(quantity) > 0)
            .map(([productId, quantity]) => ({ productId: Number(productId), quantity: Number(quantity) }));

        if (itemsToReturn.length === 0) {
            alert('Please select at least one item to return.');
            return;
        }
        if (!reasonCode) {
            alert('Please select a reason for the return.');
            return;
        }
        
        onSubmit({
            orderId: order.id,
            items: itemsToReturn,
            reasonCode,
            reasonDetail,
        });
        onClose();
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-[--bg-secondary] rounded-lg shadow-2xl p-8 w-full max-w-2xl max-h-full overflow-y-auto">
                <h2 className="text-2xl font-bold font-cinzel text-[--text-primary] mb-6">Request a Return</h2>
                <p className="text-[--text-muted] mb-4 text-sm">For order: <span className="font-mono">{order.id}</span></p>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 mb-6">
                        <h3 className="font-semibold text-[--accent]">Select Items to Return</h3>
                        {order.items.map(item => (
                            <div key={item.id} className="flex justify-between items-center p-3 bg-[--bg-primary] rounded-md">
                                <div className="flex items-center gap-3">
                                    {/* FIX: Use `item.media[0]?.url` instead of the non-existent `item.imageUrl` property. */}
                                    <img src={item.media[0]?.url} alt={t(item.name)} className="w-12 h-12 object-cover rounded"/>
                                    <div>
                                        <p className="font-semibold text-[--text-secondary]">{t(item.name)}</p>
                                        <p className="text-sm text-[--text-muted]">Purchased: {item.quantity}</p>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor={`return-qty-${item.id}`} className="sr-only">Return Quantity</label>
                                    <input 
                                        type="number" 
                                        id={`return-qty-${item.id}`}
                                        min="0"
                                        max={item.quantity}
                                        value={selectedItems[item.id] || 0}
                                        onChange={e => handleQuantityChange(item.id, item.quantity, parseInt(e.target.value, 10))}
                                        className="w-20 bg-[--bg-secondary] border border-[--border-color] rounded-md py-1 px-2 text-center"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div>
                             <label htmlFor="reasonCode" className="block text-sm font-medium text-[--text-muted] mb-2">Reason for Return</label>
                             <select 
                                id="reasonCode"
                                value={reasonCode}
                                onChange={e => setReasonCode(e.target.value as ReturnReasonCode)}
                                required
                                className="w-full bg-[--bg-primary] border border-[--border-color] rounded-md p-2"
                             >
                                {RETURN_REASONS.map(reason => (
                                    <option key={reason.code} value={reason.code}>{reason.description}</option>
                                ))}
                             </select>
                        </div>
                        <div>
                            <label htmlFor="reasonDetail" className="block text-sm font-medium text-[--text-muted] mb-2">Additional Details (optional)</label>
                            <textarea 
                                id="reasonDetail"
                                value={reasonDetail}
                                onChange={e => setReasonDetail(e.target.value)}
                                rows={3}
                                className="w-full bg-[--bg-primary] border border-[--border-color] rounded-md p-2"
                                placeholder="e.g., The wand arrived snapped in half."
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-[--bg-tertiary] text-[--text-secondary] font-semibold rounded-full hover:bg-[--border-color] transition-colors">Cancel</button>
                        <button type="submit" className="px-8 py-2 bg-[--accent] text-[--accent-foreground] font-bold rounded-full hover:bg-[--accent-hover] transition duration-300">Submit Request</button>
                    </div>
                </form>

            </div>
        </div>
    );
};
