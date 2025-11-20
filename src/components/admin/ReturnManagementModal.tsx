


import React, { useState, FormEvent } from 'react';
import { Order, ReturnRequest, ReturnStatus } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { RETURN_REASONS } from '../../data/reasons';
import { getTrackingInfo } from '../../services/logisticsService';

const ALL_RETURN_STATUSES: ReturnStatus[] = [
    'Pending Approval',
    'Approved - Awaiting Return',
    'In Transit',
    'Received - Pending Inspection',
    'Inspection Complete - Approved',
    'Inspection Complete - Rejected',
    'Completed - Refunded',
    'Completed - Store Credit Issued',
    'Completed - Replacement Sent',
    'Rejected',
];

const TrackingInfoDisplay: React.FC<{ trackingNumber: string }> = ({ trackingNumber }) => {
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        const fetchTracking = async () => {
            setIsLoading(true);
            const data = await getTrackingInfo(trackingNumber);
            setHistory(data);
            setIsLoading(false);
        };
        fetchTracking();
    }, [trackingNumber]);

    if (isLoading) return <p className="text-sm text-gray-400">Loading tracking...</p>;

    return (
        <div className="mt-2 text-xs space-y-1">
            {history.length > 0 ? (
                <p><strong>{history[0].status}</strong> at {history[0].location}</p>
            ) : <p>No tracking data found.</p>}
        </div>
    );
};

interface ReturnManagementModalProps {
    returnRequest: ReturnRequest;
    order: Order;
    onClose: () => void;
    onUpdate: (updatedRequest: Partial<ReturnRequest> & { id: string }) => void;
}

export const ReturnManagementModal: React.FC<ReturnManagementModalProps> = ({ returnRequest, order, onClose, onUpdate }) => {
    const { t } = useLanguage();
    const { formatPrice } = useCurrency();
    const [status, setStatus] = useState(returnRequest.status);
    const [resolutionType, setResolutionType] = useState(returnRequest.resolutionType);
    const [adminNotes, setAdminNotes] = useState(returnRequest.adminNotes || '');
    const [returnTrackingNumber, setReturnTrackingNumber] = useState(returnRequest.returnTrackingNumber || '');
    const [replacementTrackingNumber, setReplacementTrackingNumber] = useState(returnRequest.replacementTrackingNumber || '');
    
    const reason = RETURN_REASONS.find(r => r.code === returnRequest.reasonCode);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onUpdate({
            id: returnRequest.id,
            status,
            resolutionType,
            adminNotes,
            returnTrackingNumber,
            replacementTrackingNumber,
            resolutionDate: (status.startsWith('Completed') || status === 'Rejected') ? new Date().toISOString() : undefined,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-[--bg-secondary] rounded-lg shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] flex flex-col">
                <h2 className="text-2xl font-bold font-cinzel text-[--text-primary] mb-2">Manage Return Request</h2>
                <p className="text-sm text-[--text-muted] mb-6">Return ID: <span className="font-mono">{returnRequest.id}</span></p>

                <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-6">
                    {/* Request Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[--bg-tertiary]/50 p-4 rounded-lg">
                            <h3 className="font-semibold text-[--accent] mb-2">Customer & Order</h3>
                            <p className="text-sm"><span className="text-[--text-muted]">Customer:</span> {order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                            <p className="text-sm"><span className="text-[--text-muted]">Order ID:</span> <span className="font-mono">{order.id}</span></p>
                            <p className="text-sm"><span className="text-[--text-muted]">Request Date:</span> {new Date(returnRequest.requestDate).toLocaleDateString()}</p>
                        </div>
                        <div className="bg-[--bg-tertiary]/50 p-4 rounded-lg">
                            <h3 className="font-semibold text-[--accent] mb-2">Reason for Return</h3>
                            <p className="text-sm font-bold text-[--text-secondary]">{reason ? reason.description : returnRequest.reasonCode}</p>
                            {returnRequest.reasonDetail && <p className="text-sm text-[--text-secondary] italic mt-1">"{returnRequest.reasonDetail}"</p>}
                        </div>
                    </div>

                    {/* Items */}
                    <div>
                        <h3 className="font-semibold text-[--accent] mb-2">Items in Request</h3>
                        <div className="space-y-2">
                             {returnRequest.items.map(item => {
                                const product = order.items.find(p => p.id === item.productId);
                                return (
                                     <div key={item.productId} className="flex justify-between items-center p-2 bg-[--bg-tertiary]/50 rounded-md">
                                        <div className="flex items-center gap-3">
                                            {/* FIX: Use `product?.media[0]?.url` instead of the non-existent `product?.imageUrl` property. */}
                                            <img src={product?.media[0]?.url} alt={t(product?.name || {en: ''})} className="w-10 h-10 object-cover rounded"/>
                                            <p className="font-semibold text-sm">{t(product?.name || {en: 'Unknown'})} x {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-semibold">{formatPrice((product?.pricing[order.currency] || 0) * item.quantity, order.currency)}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    
                    {/* Tracking Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[--border-color] pt-4">
                        <div>
                             <h3 className="font-semibold text-[--accent] mb-2">Return Shipment (Inbound)</h3>
                             <label htmlFor="returnTrackingNumber" className="block text-xs font-medium text-[--text-muted]">Tracking Number</label>
                             <input id="returnTrackingNumber" type="text" value={returnTrackingNumber} onChange={e => setReturnTrackingNumber(e.target.value)} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3 text-sm" />
                             {returnTrackingNumber && <TrackingInfoDisplay trackingNumber={returnTrackingNumber} />}
                        </div>
                         <div>
                             <h3 className="font-semibold text-[--accent] mb-2">Replacement Shipment (Outbound)</h3>
                             <label htmlFor="replacementTrackingNumber" className="block text-xs font-medium text-[--text-muted]">Tracking Number</label>
                             <input id="replacementTrackingNumber" type="text" value={replacementTrackingNumber} onChange={e => setReplacementTrackingNumber(e.target.value)} disabled={resolutionType !== 'Replacement'} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3 text-sm disabled:bg-gray-700" />
                             {replacementTrackingNumber && <TrackingInfoDisplay trackingNumber={replacementTrackingNumber} />}
                        </div>
                    </div>


                    {/* Management Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 border-t border-[--border-color] pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-[--text-muted]">Update Status</label>
                                <select id="status" value={status} onChange={e => setStatus(e.target.value as ReturnStatus)} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3">
                                    {ALL_RETURN_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                             <div>
                                <label htmlFor="resolutionType" className="block text-sm font-medium text-[--text-muted]">Resolution Type</label>
                                <select id="resolutionType" value={resolutionType} onChange={e => setResolutionType(e.target.value as ReturnRequest['resolutionType'])} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3">
                                    <option value="">-- Select --</option>
                                    <option value="Refund">Refund</option>
                                    <option value="Store Credit">Store Credit</option>
                                    <option value="Replacement">Replacement</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="adminNotes" className="block text-sm font-medium text-[--text-muted]">Admin Notes (Internal)</label>
                            <textarea id="adminNotes" value={adminNotes} onChange={e => setAdminNotes(e.target.value)} rows={3} className="mt-1 block w-full bg-[--bg-primary] border border-[--border-color] rounded-md p-2" placeholder="e.g., Customer contacted support, item confirmed as damaged."></textarea>
                        </div>
                    </form>
                </div>
                
                <div className="flex justify-end gap-4 pt-6 border-t border-[--border-color] mt-auto">
                    <button type="button" onClick={onClose} className="px-6 py-2 bg-[--bg-tertiary] text-[--text-secondary] font-semibold rounded-full hover:bg-[--border-color] transition-colors">Cancel</button>
                    <button type="submit" onClick={handleSubmit} className="px-8 py-2 bg-[--accent] text-[--accent-foreground] font-bold rounded-full hover:bg-[--accent-hover] transition duration-300">Save Changes</button>
                </div>
            </div>
        </div>
    );
};
